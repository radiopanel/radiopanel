import * as bcryptjs from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
	BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
import { UserMeta } from './user-meta.entity';
import { AuthenticationMethod } from './authentication-method.entity';

@Entity()
export class User {
	public static hashPassword(password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcryptjs.hash(password, 10, (err, hash) => {
				if (err) {
					return reject(err);
				}
				resolve(hash);
			});
		});
	}

	public static comparePassword(user: User, password: string): Promise<boolean> {
		return new Promise((resolve) => {
			bcryptjs.compare(password, user.password, (err, res) => {
				resolve(res === true);
			});
		});
	}

	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public username: string;

	@Column()
	public avatar: string;

	@Column()
	public authenticationMethodUuid: string;

	@ManyToOne(() => AuthenticationMethod, authMethod => authMethod.uuid)
	public authenticationMethod: AuthenticationMethod;

	@Column()
	public bio: string;

	@IsNotEmpty()
	@Column()
	public email: string;

	@IsNotEmpty()
	@Exclude({
		toPlainOnly: true,
	})
	@Column()
	public password: string;

	@Column()
	public updatedAt: Date;

	@ManyToMany(() => Role, role => role.users)
	@JoinTable({
		name: 'user_role'
	})
	public roles: Role[];

	@OneToMany(() => UserMeta, userMeta => userMeta.user, {
		eager: true,
	})
	public _userMeta: UserMeta[];

	@Column()
	public createdAt: Date;

	@Column({ type: 'jsonb', nullable: true })
	public socials: any;

	@BeforeInsert()
	public async hashPassword(): Promise<void> {
		this.password = await User.hashPassword(this.password);
	}

}
