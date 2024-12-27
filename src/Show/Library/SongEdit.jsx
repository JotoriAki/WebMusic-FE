import classNames from "classnames/bind";
import { useState } from "react";

import styles from "./Library.module.scss";
import { message, Button,  Select, Input, Flex, notification, Result, Spin, Space } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { Link } from "react-router-dom";
import { editSong } from "../../Actions/SongAction";

const cx = classNames.bind(styles);

function SongEdit({data, handlePopupEditSongFalse }) {
    const [jpgList, setJpgList] = useState([]);
    const [nameMusic, setNameMusic] = useState(data.title);
    const [content, setContent] = useState(data.content);
    const [type, setType] = useState(data.id_Types);

    const [success, setSuccess] = useState(0);

    const actor = localStorage.getItem("user");

    const handleUpload = async(id) => {
        setSuccess(1);
        const convertTypesToNumber = (types) => {
            return types.map((type) => parseInt(type));
        };
        console.log(convertTypesToNumber(type));
        await editSong(id, convertTypesToNumber(type), nameMusic,actor, content, jpgList);
            handlePopupEditSongFalse();

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
    

    const propsJpg = {
        name: 'file',
        multiple: false,
        jpgList,
        fileList: jpgList,
        accept: '.jpg, .jpeg, .png',
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
                    message: 'Upload Image failed',
                    description: info.file.response.error || 'An error occurred during image upload.'
                });
            }
        }
    };
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
    const toString = (value) => {
        let type = [];
        value.forEach((element) => {
            type.push(element.toString());
        });
        return type;
    }
    return (
        
        <div className={cx("Background-Upload")}>
        <Container className={cx("upload")} style={{margin: 0}}>
        {success === 2 && (
            <Result
            status="success"
            title="Successfully Upload your song"
            subTitle="You can continue uploading songs or return to the home page."
            extra={[
                <Link to="/">
              <Button type="primary" key="console">
                Home
              </Button>
              </Link>,
              <Button key="buy">Continue uploading</Button>,
            ]}
          />
        )}
        {success === 1 && (
            <Spin tip="Loading" size="large">
             ㅤㅤㅤㅤ
             ㅤㅤㅤㅤ
             ㅤㅤㅤㅤ
          </Spin>
        )}
{success === 0 && (
    <div>
    <h3 style={{textAlign: "center", marginBottom: "30px"}} >Chỉnh Sửa Nhạc "{data.title}"</h3>
    <Row className={cx("upload-top")}>
        <Col xl='6'>
            <Dragger {...propsJpg}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined  style={{color: "#ff5500"}}/>
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo thẻ file hình vào đây để upload</p>
                <p className="ant-upload-hint">
                    Hình ảnh chỉ chấp nhận các định dạng: .jpg, .jpeg, .png
                </p>
            </Dragger>
            
        </Col>
        <Col xl='5' className={cx("upload-right")}>
            <Row>
                <Col xl='6'>
       
                        <Input className={cx("input-name")} placeholder="Name Music" value={nameMusic} onChange={handleNameMusic}/>
      
                
                </Col>
                <Col xl='6'>
                
                <Select
                    mode="multiple"
                    style={{
                    width: '100%',
                    }}
                    placeholder="Chọn thể loại bài hát"
                    defaultValue={toString(data.id_Types)}
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

                <TextArea rows={4} placeholder="Dedescription" value={content} onChange={handleContent}/>
                <div>
                <img className={cx("img-demo")} src={jpgList[0] ? URL.createObjectURL(jpgList[0]) : data.img} alt=""/>
                </div>
            </Row>
        </Col>
    </Row>
    <Button type="primary" style={{backgroundColor: "#ff5500"}} onClick={() => handleUpload(data._id)} className={cx("upload-btn")}>Complete Edit Song</Button>

    </div>
)}
</Container>
            
        </div>

    );
}

export default SongEdit;