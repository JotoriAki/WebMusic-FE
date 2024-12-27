import classNames from "classnames/bind";
import { useState } from "react";

import styles from "./Upload.module.scss";
import { message, Button,  Select, Input, Flex, notification, Result, Spin, Space } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { uploadSong } from "../../Actions/SongAction";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Upload() {
    const [mp3List, setMp3List] = useState([]);
    const [jpgList, setJpgList] = useState([]);
    const [nameMusic, setNameMusic] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState([]);

    const [success, setSuccess] = useState(0);

    const actor = localStorage.getItem("user");

    const handleUpload = async() => {
        setSuccess(1);
        const convertTypesToNumber = (types) => {
            return types.map((type) => parseInt(type));
        };
        const success = await uploadSong(convertTypesToNumber(type), nameMusic, actor, content, jpgList, mp3List);
        if (success) {
            setSuccess(2);
        } else {
                                                            setSuccess(0);
        }
    };

    const handleNameMusic = (e) => {
        setNameMusic(e.target.value);
    };
    const handleContent = (e) => {
        setContent(e.target.value);
    };
    const handleType = (value) => {
        setType(value);
    };
    
console.log(mp3List);
    const propsMp3 = {
        name: 'file',
        multiple: false,
        mp3List,
        accept: '.mp3, .wav',
        fileList: mp3List,
        showUploadList: {
            showRemoveIcon: true,
        },
        beforeUpload: (file) => {
            setMp3List([file]); 
            return false; 
        },
        onRemove: () => {
            setMp3List([]); 
        },
        onChange: (info) => {
            if (info.file.status === 'done') {
                setMp3List([info.file]);
            } else if (info.file.status === 'error') {
                notification.error({
                    message: 'Tải nhạc lên thất bai',
                    description: info.file.response.error || 'An error occurred during MP3 upload.'
                });
            }
        }
    };
    const propsJpg = {
        name: 'file',
        multiple: false,
        accept: '.jpg, .jpeg, .png',
        fileList: jpgList,
        showUploadList: {
            showRemoveIcon: true,
        },
        beforeUpload: (file) => {
            setJpgList([file]);
            return false;
        },
        onRemove: () => {
            setJpgList([]);
        },
        onChange: (info) => {
            if (info.file.status === 'done') {
                setJpgList([info.file]);
            } else if (info.file.status === 'error') {
                notification.error({
                    message: 'Tải hình lên thất bai',
                    description: info.file.response.error || 'An error occurred during image upload.'
                });
            }
        }
    };
    console.log(jpgList);
    
    const ReloadUpload = () => {
        setMp3List([]);
        setJpgList([]);
        setNameMusic("");
        setContent("");
        setType(0);
        setSuccess(0);
    }
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
    return (
        
        <div className="Background-Upload">
    <Container className={cx("upload")}>
        {success === 2 && (

        <div>
            <Result
                status="success"
                title="Đăng Bài Hát Thành Công"
                subTitle="Bài hát của bạn đã được đăng thành công. Hãy chờ xem nhé!"
                extra={[
                    <Button type="primary" key="console" onClick={ReloadUpload}>
                        Đăng Bài Hát Khác
                    </Button>,
                    <Link to="/library">
                    <Button key="buy">Xem Bài Hát Tải Lên Của Bạn</Button>
                    </Link>
                ]}
            />
        </div>
        )}
        {success === 1 && (
            <div>
                <p style={{paddingBottom: "10px", fontSize: "25px"}}>Đang Tải Lên Bài Hát Của Bạn</p>
            <Spin tip="Loading" size="large">
             ㅤㅤㅤㅤ
             ㅤㅤㅤㅤ
             ㅤㅤㅤㅤ
          </Spin>
          </div>
        )}
{success === 0 && (
    <div>
    <h3>Tải Lên Bài Hát Của Bạn</h3>
    <Row className={cx("upload-top")}>
        <Col xl='6'>
            <Dragger {...propsJpg}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined  style={{color: "#007bff"}}/>
                </p>
                <p className="ant-upload-text">Nhấn hoặc thả hình vào đây</p>
                <p className="ant-upload-hint">
                    Chỉ hỗ trợ tải lên một file hình ảnh duy nhất. Kéo thả file thứ hai sẽ thay thế file hiện tại.
                </p>
            </Dragger>
        </Col>
        <Col xl='5' className={cx("upload-right")}>
            <Row>
                <Col xl='6'>
       
                        <Input className={cx("input-name")} placeholder="Tên bài hát" onChange={handleNameMusic}/>
      
                
                </Col>
                <Col xl='6'>
                
                <Select
                    mode="multiple"
                    style={{
                    width: '100%',
                    }}
                    placeholder="Chọn thể loại bài hát"
                    defaultValue={[]}
                    onChange={handleType}
                    options={options}
                    optionRender={(option) => (
                    <Space>
                        <span role="img" aria-label={option.data.label}>
                        {option.data.label}
                        </span>
   
                    </Space>
                    )}
                />
                </Col>

                <TextArea rows={4} placeholder="Mô tả bài hát" onChange={handleContent}/>
       
            </Row>
        </Col>
    </Row>
     <Dragger {...propsMp3}>
         <p className="ant-upload-drag-icon">
             <InboxOutlined style={{color: "#007bff"}}/>
         </p>
         <p className="ant-upload-text">Nhấn hoặc thả file nhạc vào đây</p>
         <p className="ant-upload-hint">
                Chỉ hỗ trợ tải lên một file nhạc duy nhất. Kéo thả file thứ hai sẽ thay thế file hiện tại.
         </p>
     </Dragger>
    <Button type="primary" style={{backgroundColor: "#007bff"}} onClick={handleUpload} className={cx("upload-btn")}>Tải lên bài hát</Button>

    </div>
)}
</Container>
            
        </div>

    );
}

export default Upload;