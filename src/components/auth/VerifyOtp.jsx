import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Get email from Registration redirect
    const email = location.state?.email || "";
    console.log("VerifyOtp loaded with email:", email);

    // ✅ Store OTP as array of 6 digits
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputRefs = useRef([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ Handle OTP input changes
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus next input
        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // ✅ Handle backspace navigation
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // ✅ Handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join(""); // Convert array to string

        try {
            const response = await axios.post("http://localhost:9192/auth/verify-otp", {
                email,
                otp: enteredOtp
            });
            setSuccessMessage(response.data); // "OTP verified successfully!"
            setErrorMessage("");

            // Redirect to login page after successful verification
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setErrorMessage(error.response?.data || "OTP verification failed");
            setSuccessMessage("");
        }
    };

    // ✅ Handle resending OTP
    const handleResendOtp = async () => {
        try {
            const response = await axios.post("http://localhost:9192/auth/resend-otp", { email });
            setSuccessMessage(response.data); // "New OTP sent to your email!"
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response?.data || "Failed to resend OTP");
            setSuccessMessage("");
        }
    };

    return (
        <section className="container col-6 mt-5 mb-5">
            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

            <h2>Verify OTP</h2>
            <p>Enter the OTP sent to your email: <strong>{email}</strong></p>

            <form onSubmit={handleVerifyOtp}>
                <div className="mb-3 d-flex justify-content-between">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            className="otp-input"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            
                        />
                    ))}
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
                        Verify OTP
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </button>
                </div>
            </form>
        </section>
    );
};

export default VerifyOtp;
