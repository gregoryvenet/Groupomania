// Formation OpenClassrooms - Développeur Web - Projet 7 - Grégory VENET

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LoginContext } from "./AppContext";
import logo from "../styles/assets/icons/icon-left-font-monochrome-black.svg";
import Users from "../styles/assets/icons/users.svg";
import Notify from "../styles/assets/icons/notification-bell.svg";
import User from "../styles/assets/icons/user.svg";
import Logout from "./log/LogoutLog";
import ImgLogin from "../styles/assets/icons/login.svg";
import { useSelector } from "react-redux";

const Navbar = () => {
	const myToken = useContext(LoginContext);
	const userData = useSelector((state) => state.userReducer);

	return (
		<nav>
			<div className="nav-container">
				<div className="logo">
					<NavLink to="/">
						<img src={logo} alt="logo Groupomania" />
					</NavLink>
					{myToken ? (
						<ul>
							<li className="welcome">
								<NavLink to="/">
									<h5>Bienvenue {userData.lastName}</h5>
								</NavLink>
							</li>
							<NavLink to="/profil">
								<img src={User} alt="Icône utilisateur" />
							</NavLink>
							<NavLink to="/notify">
								<img src={Notify} alt="Icône de notification" />
							</NavLink>
							<NavLink to="/users">
								<img src={Users} alt="Icône des utilisateurs" />
							</NavLink>
							<Logout />
						</ul>
					) : (
						<ul>
							<li></li>
							<li>
								<NavLink to="/profil">
									<img src={ImgLogin} alt="login" />
								</NavLink>
							</li>
						</ul>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;