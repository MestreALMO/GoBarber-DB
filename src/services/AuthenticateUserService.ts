import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination');
    }

    // user.password = Senha criptografada
    // password = senha não criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination');
    }

    // User Authenticated

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });
    /** sign({}, ); = cria a assinatura
     * parametro 01 = o que fica aqui dentro fica dentro do token mas não é seguro, mas é o que precisamos utilizar na aplicação como id
     * parametro 02 = o segundo parâmetro é uma chave secreta, o mais comum é uma string, mas pode ser colocado outra coisa
     * parametro 03.1 = é o subject, sempre colocaremos nele o user.id
     * parametro 03.2 = quanto tempo o token é válido para permitir que user fique logado, existem estratégia pra usarmos refresh token aqui
     */

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
