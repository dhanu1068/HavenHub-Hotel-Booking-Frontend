import React, { useState } from "react"
import { registerUser } from "../utils/ApiFunctions"
import { Link,useNavigate } from "react-router-dom"

const Registration = () => {
	const [registration, setRegistration] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	})

	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")



	 const navigate = useNavigate(); //Added for redirection

	const handleInputChange = (e) => {
		setRegistration({ ...registration, [e.target.name]: e.target.value })
	}


	// frontend validation
	const validateForm = () => {
		if (!registration.firstName.trim()) return "First name is required"
		if (!registration.lastName.trim()) return "Last name is required"
		if (!registration.email.includes("@")) return "Valid email is required"
		if (registration.password.length < 6) return "Password must be at least 6 characters"
		return null
	}

	const handleRegistration = async (e) => {
		e.preventDefault()
		// run validation before API call
		const error = validateForm()
		if (error) {
			setErrorMessage(error)
			setTimeout(() => setErrorMessage(""), 5000)
			return
		}
		try {
			// const result = await registerUser(registration)
			// setSuccessMessage(result)
			// setErrorMessage("")
			await registerUser(registration)
			  // 👇 Add console.log right here
        console.log("Redirecting to verify-otp with email:", registration.email)
			 //Redirect to OTP verification page and pass email
            navigate("/verify-otp", { state: { email: registration.email } });
			setRegistration({ firstName: "", lastName: "", email: "", password: "" })
			 // Optional: you can set success message for OTP page to show
    setSuccessMessage("Registration successful! Please check your email for OTP.");
		} catch (error) {
			setSuccessMessage("")
			setErrorMessage(`Registration error : ${error.message}`)
		}
		
	}

	return (
		<section className="container col-6 mt-5 mb-5">
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			{successMessage && <p className="alert alert-success">{successMessage}</p>}

			<h2>Register</h2>
			<form onSubmit={handleRegistration}>
				<div className="mb-3 row">
					<label htmlFor="firstName" className="col-sm-2 col-form-label">
						first Name
					</label>
					<div className="col-sm-10">
						<input
							id="firstName"
							name="firstName"
							type="text"
							className="form-control"
							value={registration.firstName}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="lastName" className="col-sm-2 col-form-label">
						Last Name
					</label>
					<div className="col-sm-10">
						<input
							id="lastName"
							name="lastName"
							type="text"
							className="form-control"
							value={registration.lastName}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="email" className="col-sm-2 col-form-label">
						Email
					</label>
					<div className="col-sm-10">
						<input
							id="email"
							name="email"
							type="email"
							className="form-control"
							value={registration.email}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="mb-3 row">
					<label htmlFor="password" className="col-sm-2 col-form-label">
						Password
					</label>
					<div className="col-sm-10">
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							value={registration.password}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div className="mb-3">
					<button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
						Register
					</button>
					





					<span style={{ marginLeft: "10px" }}>
						Already have an account? <Link to={"/login"}>Login</Link>
					</span>
				</div>
			</form>
		</section>
	)
}

export default Registration
