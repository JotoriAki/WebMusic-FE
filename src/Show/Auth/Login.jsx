import classNames from "classnames/bind";



import style from "./Register.module.scss";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect} from "react-redux";
import { getSong, signin, signup } from "../../Actions/AuthAction";
import { Button, Input } from "semantic-ui-react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const cx =  classNames.bind(style);


function Login({clickerRegister, clickerVeryEmail, signin}) {
    const [hidePass, setHidePass] = useState(false);
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormLogin({ ...formLogin, [name]: value });
    };

    const IsHidePassword  = () =>{
        setHidePass(!hidePass)
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        signin(formLogin);
    }
    return ( 
    <Container className={cx("Register")}>
        <Form onSubmit={(e) => handleSubmit(e)}> 
            <h3>Đăng Nhập</h3>

                <Row className={cx("nd")}>
                <Col>
                    <p>Email:</p>
                </Col>
                </Row>
                <Row>
                <Col xl='11'>
                    <Input className={cx("inputreg")} name="email" value={formLogin.email} onChange={handleChange} placeholder="type your Email"  type="text" />
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
                        <Input className={cx("inputreg")} name="password" type={hidePass ? "text" : "password"} value={formLogin.password} onChange={handleChange} placeholder="type your Password"  ></Input>
                        </Col>
                        <Col>
                        {!hidePass && <EyeOutlined icon={faCheck} onClick={IsHidePassword} className={cx("eye")}/>}
                        {hidePass && <EyeInvisibleOutlined icon={faCircleXmark} onClick={IsHidePassword} className={cx("eye")}/>}
                        </Col>
                    </Row>
                </Col>
                </Row>
            <Row>
                <Col className={cx("btn_login_Cha")}>
                    <Button className={cx("btn_login")} variant="contained" type="submit" >Đăng Nhập</Button>
                </Col>
            </Row>
            <Row>
                <Col className={cx("goLogin")} >
                    <p>Bạn Chưa có tài khoản? <Button onClick={clickerRegister}>Create Account</Button></p>
                </Col>
            </Row>
            <Row>
                <Col className={cx("goRePassword")} >
                    <p onClick={clickerVeryEmail}>Quên Mật Khẩu?</p>
                </Col>
            </Row>
            </Form>
        </Container>
    );
}

export default connect(null, { signin: signin })(Login);