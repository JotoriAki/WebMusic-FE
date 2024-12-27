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
import { changePassword} from "../../Actions/UserAction";

const cx =  classNames.bind(style);


function RePassword() {
    const [hidePass, setHidePass] = useState(false);
    
  const [formRegister, setFormRegister] = useState({
    email: localStorage.getItem('emailconfirm'),
    newPassword: "",
    confirmPassword: "",
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
        changePassword(formRegister);
        localStorage.removeItem('emailconfirm');
    }
    return ( 
    <div className={cx("Register")}>
        <Form> 
            <h3>Đặt Mật Khẩu Mới</h3>
                <Row className={cx("nd")}>
                <Col>
                    <p>Mật Khẩu Mới</p>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Row>
                        <Col xl='11'>
                            <Input className={cx("inputreg")} name="newPassword" type={hidePass ? "text" : "password"} value={formRegister.newPassword} onChange={handleChange} placeholder="nhập mật khẩu mới" ></Input>
                        </Col>
                        <Col>
                            {!hidePass && <EyeOutlined icon={faCheck} onClick={IsHidePassword} className={cx("eye")}/>}
                            {hidePass && <EyeInvisibleOutlined icon={faCircleXmark} onClick={IsHidePassword} className={cx("eye")}/>}
                        </Col>
                    </Row>
                </Col>
                </Row>
                <Row className={cx("nd")}>
                <Col>
                    <p>Nhập Lại Mật Khẩu Mới</p>
                </Col>
                </Row>
                <Row>
                <Col>
                    <Row>
                        <Col xl='11'>
                            <Input className={cx("inputreg")} name="confirmPassword" type={hidePass ? "text" : "password"} value={formRegister.confirmPassword} onChange={handleChange} placeholder="nhập mật khẩu mới" ></Input>
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
                    <Button className={cx("btn_login")} type="submit" onClick={handleSubmit}>Hoàn Thành Đổi Mật Khẩu</Button>
                </Col>
            </Row>

            </Form>
        </div>
    );
}

export default connect(null, { signup: signup })(RePassword);