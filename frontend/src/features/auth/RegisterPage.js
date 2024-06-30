import React, { useState } from 'react';
import { Form, redirect, useActionData, useRouteLoaderData } from "react-router-dom";
import InlineLink from "../../components/InlineLink/InlineLink";
import globalStyles from "../../App.module.css";
import GoogleAuthButton from "./GoogleAuthButton";
// import FacebookAuthButton from "./FacebookAuthButton";
import zxcvbn from 'zxcvbn'; //password strength checking library

export async function registerAction({ request }) {
    let formData = await request.formData();
    try {
      const email = formData.get("email_address");
      const password = formData.get("password");
      const username = formData.get("username");
      const name = formData.get("name");
  
      const registerResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username, name })
        }
      );
  
      if (registerResponse.status === 200 || registerResponse.status === 201) {
        const loginResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
          }
        );
  
        if (loginResponse.ok) {
          return redirect("/account");
        } else if (loginResponse.status === 401) {
          return "Login failed. The username or password is incorrect.";
        }
  
        throw new Error("Unexpected status code during login.");
      } else if (registerResponse.status === 400) {
        return "Error: This email is already registered.";
      }
  
      throw new Error("Unexpected status code during registration.");
    } catch (error) {
      console.log("RegisterPage.js - Unexpected status code.");
      return "Registration failed. Please try again later.";
    }
  }

export function RegisterPage() {
  const authData = useRouteLoaderData("app");
  const registrationError = useActionData();
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const loginLink = <InlineLink path="/login" anchor="log in" />;
  const loggedOutContent = (
    <>Create an account or sign in with Google.
    If you have an account, please {loginLink} instead.</>
  );
  const loggedInContent = <>You are logged in as {authData.email_address}.</>;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0: return 'red';
      case 1: return 'red';
      case 2: return 'darkorange';
      case 3: return 'blue';
      case 4: return 'green';
      default: return '';
    }
  };
  return (
    <div className={`${globalStyles.pagePadding} ${globalStyles.mw80rem}`}>
      <h1 className={globalStyles.h1}>Create account</h1>
      <p className={globalStyles.mb2rem}>{authData.logged_in ? loggedInContent : loggedOutContent}</p>
      <Form method="post" className={globalStyles.stackedForm}>
        <label htmlFor="email_address" className={globalStyles.label}>Email</label>
        <input id="email_address" className={globalStyles.input} type="email" name="email_address" minLength={5} required />
        
        <label htmlFor="password" className={globalStyles.label}>Password</label>
        <input 
          id="password" 
          className={globalStyles.input} 
          type="password" 
          name="password" 
          minLength={8} 
          maxLength={55} 
          required 
          value={password} 
          onChange={handlePasswordChange} 
        />
        <div className={globalStyles.passwordCheck}>
          Password Strength: <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>
            {getPasswordStrengthLabel(passwordStrength)}
          </span>
        </div>

        <label htmlFor="username" className={globalStyles.label}>Username</label>
        <input id="username" className={globalStyles.input} type="text" name="username" required />
        
        <label htmlFor="name" className={globalStyles.label}>Name</label>
        <input id="name" className={globalStyles.input} type="text" name="name" required />
        
        {/* <label htmlFor="lastName" className={globalStyles.label}>Last Name</label>
        <input id="lastName" className={globalStyles.input} type="text" name="lastName" required />
        */}
        <button type="submit" className={globalStyles.button}>Register</button>
    
      </Form>
      <p>{registrationError ? registrationError : null}</p>
      <hr className={globalStyles.separator} />
      <GoogleAuthButton />
      {/* <FacebookAuthButton /> */}
    </div>
  );
}