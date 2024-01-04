import { JWTAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDTO,
  RegisterUserDTO,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email-service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDTO: RegisterUserDTO) {
    const existUser = await UserModel.findOne({ email: registerUserDTO.email });
    if (existUser) throw CustomError.badRequest("Email already exist !!");

    try {
      const user = new UserModel(registerUserDTO);

      // Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDTO.password);

      await user.save();

      //Email de confirmacion
      this.sendEmailValidationLink(user.email);

      const { password, ...rest } = UserEntity.fromObject(user);

      const token = await JWTAdapter.generateToken({
        id: user.id,
        email: user.email,
      });
      if (!token)
        throw CustomError.internalServer("Error while creating JWT !!");

      return {
        user: rest,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDTO: LoginUserDTO) {
    const user = await UserModel.findOne({ email: loginUserDTO.email });
    if (!user) throw CustomError.badRequest("Email not found !!");

    const isMatching = bcryptAdapter.compare(
      loginUserDTO.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest("Password is not valid !!");

    const { password, ...rest } = UserEntity.fromObject(user);

    const token = await JWTAdapter.generateToken({
      id: user.id,
      email: user.email,
    });
    if (!token) throw CustomError.internalServer("Error while creating JWT !!");

    return {
      user: rest,
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JWTAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token !!");

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p> Click on the following link to validate your email</p>
      <a href="${link}"> Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer("Error sending email !!");

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JWTAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid Token !!");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token !!");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("email does not exist !!");

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
