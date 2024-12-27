import classNames from "classnames/bind";
import Styles from "./Setting.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import { EditOutlined, FormOutlined, HighlightOutlined, LoadingOutlined, ToolOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button, Select, Spin } from "antd";
import { getUserByUserUnique, updateUserInterest, updateUsername, updateUsernameUnique } from "../../Actions/UserAction";


const cx = classNames.bind(Styles);
function Setting() { 
    const userUnique = localStorage.getItem('user');
    const email = localStorage.getItem('email');
    const [isRender, setisRender] = useState(true);
    const [isOption, setIsOption] = useState("doiten");
    const [newName, setNewName] = useState("");
    const [newNameUnique, setNewNameUnique] = useState("");
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        getUserByUserUnique(userUnique).then((res) => {
        setUser(res);
      });
    }, [userUnique]);

    const options = [
        { value: '1', label: 'RnB' },
        { value: '2', label: 'Pop' },
        { value: '3', label: 'Ballad'},
        { value: '4', label: 'Rap'},
        { value: '5', label: 'Latin'},
        { value: '6', label: 'Rock'},
        { value: '7', label: 'Phonk'},
        { value: '8', label: 'Lofi'},
        { value: '9', label: 'BGM'},
        { value: '10', label: 'Jersey Club'},
      ];

    const HandleOption = (option) => {
        setIsOption(option);
    }

    useEffect(() => {

    }, [newNameUnique]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };
    const handleNameUniqueChange = (e) => {
        setNewNameUnique(e.target.value);
    };

    // interest is an array of strings
    const convertInterestsToValues = (interests) => {
        const interestMap = {
            'RnB': '1',
            'Pop': '2',
            'Ballad': '3',
            'Rap': '4',
            'Latin': '5',
            'Rock': '6',
            'Phonk': '7',
            'Lofi': '8',
            'BGM': '9',
            'Jersey Club': '10'
        };
        return interests.map(interest => interestMap[interest]);
    };

    useEffect(() => {
        if (user && user.interests) {
            setFavoriteGenres(convertInterestsToValues(user.interests));
        }
    }, [user]);
    const valueInterest = favoriteGenres? favoriteGenres : user?.interests;


    return ( 
    <div>
        <Container className={cx("Setting")}>
            <Row >
                <Col xl='3' className={cx("Tab-Option")}>
                    <h3>Cài đặt và chỉnh sửa</h3>
                    <p className={cx("title-setting")}>Chỉnh sửa thông tin cá nhân</p>
                    <p className={cx("option-setting", isOption === 'doiten'? "Active" : "")} onClick={() => HandleOption("doiten")}><EditOutlined /> Đổi Tên</p>
                    {/* <p className={cx("option-setting", isOption === 'doitenunique'? "Active" : "")} onClick={() => HandleOption("doitenunique")}><HighlightOutlined /> Đổi ID Name</p> */}

                    <p className={cx("title-setting")}>Cài Đặt Khác</p>
                    <p className={cx("option-setting", isOption === 'suatheloai'? "Active" : "")} onClick={() => HandleOption("suatheloai")}><ToolOutlined /> Chỉnh sửa thể loại yêu thích</p>
                </Col>
                <Col xl='1'></Col>
                <Col className={cx("Tab-Setting")}>
                    {isOption === "doiten" && (
                        <div className={cx("doiten")}>
                            <h3>Đổi Tên Của Bạn</h3>
                            <p>Đổi tên của bạn</p>
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={handleNameChange} 
                                placeholder="Nhập tên mới của bạn" 
                            />
                            <Button onClick={() => updateUsername(userUnique, newName)}>Hoàn thành đổi tên</Button>
                        </div>
                    )}
                    {/* {isOption === "doitenunique" && (
                        <div className={cx("doitenunique")}>
                            <h3>Đổi ID Name</h3>
                            <p>Đổi ID Name của bạn</p>
                            <input 
                                type="text" 
                                value={newNameUnique} 
                                onChange={handleNameUniqueChange} 
                                placeholder="Nhập ID Name mới của bạn" 
                            />
                            <Button 
                                onClick={() => updateUsernameUnique(email, newNameUnique)}
                                disabled={newNameUnique == userUnique}
                            >
                                Hoàn thành đổi ID Name
                            </Button>
                        </div>
                    )} */}
                    {isOption === "suatheloai" && (
                        <div>
                            {favoriteGenres && (
                        <div className={cx("suatheloai")}>
                            <h3>Chỉnh sửa thể loại yêu thích</h3>
                            <p>Chỉnh sửa thể loại yêu thích của bạn</p>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Chọn thể loại yêu thích"
                                value={valueInterest}
                                onChange={(value) => setFavoriteGenres(value)}
                            >
                                {options.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Button onClick={() => updateUserInterest(userUnique, favoriteGenres)}>Hoàn thành sửa thể loại yêu thích</Button>
                            </div>
                        )}
                        {!favoriteGenres && (
                            <div className={cx("loading")}>
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                            </div>
                        )}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    </div> );
}

export default Setting;