import classNames from "classnames/bind";



import style from "./Register.module.scss";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect} from "react-redux";
import { sendOtp, signup } from "../../Actions/AuthAction";
import { Button, Input } from "semantic-ui-react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { sendOtpForRePass, veryAccount } from "../../Actions/UserAction";

const cx =  classNames.bind(style);


function VeryEmail({clickerSignin, clickerRePass}) {
const [isVery , setIsVery] = useState(false);
  const [formRegister, setFormRegister] = useState({
    email: "",
    otp: "",
  });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormRegister({ ...formRegister, [name]: value });
    };

    const ConfirmOtp = () => {
        try {
            veryAccount(formRegister).then((res) => {
                setIsVery(res);
            });
        } catch (error) {
        }
    };

    console.log(isVery);
    const sendOTP = () =>{
        sendOtpForRePass(formRegister.email);
        localStorage.setItem('emailconfirm', formRegister.email);
    }
    return ( 
    <div className={cx("Register")}>

            <h3>Quên Mật Khẩu</h3>
                <Row className={cx("nd")}>
                <Col>
                    <p>Email:</p>
                </Col>
                </Row>
                <Row>
                <Col xl='11'>
                    <Input className={cx("inputreg")} name="email" value={formRegister.email} onChange={handleChange} placeholder="nhập email mà bạn muốn lấy lại mật khẩu" type="text" />
                </Col>
                </Row>
                <Row>
                    <Col xl='8'>
                    <Input className={cx("inputotp")} name="otp" value={formRegister.otp} onChange={handleChange} placeholder="nhập otp từ email" type="text" />
                    </Col>
                    <Col xl='3' className={cx("col-otp")}>
                        <span className={cx("btn-otp")} onClick={sendOTP}>Gửi OTP</span>
                    </Col>
                </Row>
            <Row>
                <Col className={cx("btn_login_Cha")}>
                    <Button className={cx("btn_login")} variant="contained" type="submit" onClick={(e) => { e.preventDefault(); if (isVery) clickerRePass(); else ConfirmOtp(); }}>Xác thực tài khoản</Button>
                </Col>
            </Row>
            <Row>
                <Col className={cx("goLogin")} >
                    <p>Trở về trang đăng nhập? <Button onClick={clickerSignin}>Đăng nhập</Button></p>
                </Col>
            </Row>
         
        </div>
    );
}

export default connect(null, { signup: signup })(VeryEmail);