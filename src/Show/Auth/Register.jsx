import classNames from "classnames/bind";



import style from "./Register.module.scss";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect} from "react-redux";
import { sendOtp, signup } from "../../Actions/AuthAction";
import { Button, Input } from "semantic-ui-react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const cx =  classNames.bind(style);


function Register({clicker, signup}) {
    const [hidePass, setHidePass] = useState(false);
  const [formRegister, setFormRegister] = useState({
    email: "",
    username: "",
    password: "",
    otp: "",
  });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormRegister({ ...formRegister, [name]: value });
    };

    const IsHidePassword  = () =>{
        setHidePass(!hidePass)
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        signup(formRegister);
    }
    const sendOTP = () =>{
        sendOtp(formRegister.email);
    }
    return ( 
    <div className={cx("Register")}>
        <Form> 
            <h3>Create Account</h3>
            <Row className={cx("nd")}>
                <Col >
                    <p>User Name:</p>
                </Col>
            </Row>
            <Row>
                <Col xl='11'>
                    <Input className={cx("inputreg")} name="username" value={formRegister.username} onChange={handleChange} placeholder="type your UserName" type="text" />
                </Col>
                </Row>
                <Row className={cx("nd")}>
                <Col>
                    <p>Email:</p>
                </Col>
                </Row>
                <Row>
                <Col xl='11'>
                    <Input className={cx("inputreg")} name="email" value={formRegister.email} onChange={handleChange} placeholder="type your Email" type="text" />
                </Col>
                </Row>
                <Row className={cx("nd")}>
                <Col>
                    <p>Password</p>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Row>
                        <Col xl='11'>
                            <Input className={cx("inputreg")} name="password" type={hidePass ? "text" : "password"} value={formRegister.password} onChange={handleChange} placeholder="type new Password" ></Input>
                        </Col>
                        <Col>
                            {!hidePass && <EyeOutlined icon={faCheck} onClick={IsHidePassword} className={cx("eye")}/>}
                            {hidePass && <EyeInvisibleOutlined icon={faCircleXmark} onClick={IsHidePassword} className={cx("eye")}/>}
                        </Col>
                    </Row>
                </Col>
                </Row>
                <Row>
                    <Col xl='8'>
                    <Input className={cx("inputotp")} name="otp" value={formRegister.otp} onChange={handleChange} placeholder="type your OTP" type="text" />
                    </Col>
                    <Col xl='3' className={cx("col-otp")}>
                        <span className={cx("btn-otp")} onClick={sendOTP}>Sent OTP</span>
                    </Col>
                </Row>
            <Row>
                <Col className={cx("btn_login_Cha")}>
                    <Button className={cx("btn_login")} variant="contained" type="submit" onClick={handleSubmit}>Đăng ký</Button>
                </Col>
            </Row>
            <Row>
                <Col className={cx("goLogin")} >
                    <p>Bạn đã có tài khoản? <Button onClick={clicker}>Đăng nhập</Button></p>
                </Col>
            </Row>
            </Form>
        </div>
    );
}

export default connect(null, { signup: signup })(Register);