import classNames from "classnames/bind";

import styles from "./Header.module.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowDown, faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import { Dropdown } from "semantic-ui-react";
import { getUserByEmail, searchUser, seen } from "../../Actions/UserAction";
import { searchSong } from "../../Actions/SongAction";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { io} from "socket.io-client";
import VeryEmail from "../Auth/VeryEmail";
import RePassword from "../Auth/RePassword";



import logo from "../Img/Logo.png";
import { notification, Popover } from "antd";
import socket from "../../socket";

const cx = classNames.bind(styles);

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRePassoword, setShowRePassowrd] = useState(false);
  const [showVeryEmail, setShowVeryEmail] = useState(false);
  const [logined, setlogined] = useState(false);
  const [avt, setAvt] = useState(null);
  const [usernameUnique, setUsernameUnique] = useState(null);
  const [search, setSearch] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const [notification, setNotification] = useState([]);
  const [isRender, setIsRender] = useState(false);
  // const [numberNoti, setNumberNoti] = useState(0);
  
// check active search
const handleFocus = () => {
  setIsInputActive(true); // Khi người dùng nhấp vào ô input
};

const handleBlur = () => {
  setIsInputActive(false); // Khi người dùng rời khỏi ô input
};

  const email = localStorage.getItem('email');
  const UserNameUniqueLoined = localStorage.getItem('user');
useEffect(() => {
  if(localStorage.getItem("authenticate") === 'true'){
    setlogined(true);
  }
}, [logined])
  const handleLoginClick = () => {
    setShowLogin(true);
    document.body.style.overflow = 'hidden';
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowRePassowrd(false);
    document.body.style.overflow = 'hidden';
  }
  const openLogin = () => {
    setShowVeryEmail(false);
    setShowLogin(true);
    setShowRegister(false);
    setShowRePassowrd(false);
    document.body.style.overflow = 'hidden';
  }
  const OpenRePassowrd = () => {
    setShowVeryEmail(false);
    setShowRePassowrd(true);
    
    document.body.style.overflow = 'hidden';
  };
  const OpenVeryEmail = () => {
    setShowVeryEmail(true);
    setShowLogin(false);
    document.body.style.overflow = 'hidden';
  };
  const handleRegisterClick = () => {
    setShowRegister(true);
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowRePassowrd(false);
    setShowVeryEmail(false);
    document.body.style.overflow = 'auto';
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticate');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    socket.emit('allowDisconnect');
    window.location.reload();
  }

// get avt by email
  useEffect(() => {
    getUserByEmail(email).then((res) => {
      setAvt(res?.avt);
      setUsernameUnique(res?.userNameUnique);
      setNotification(res?.notifications.reverse());

  });
  setIsRender(false);
  }, [avt, email, isRender]);

  //search
  const navigate = useNavigate();
  const searchEnter = (() => {
    if (search.trim()) {
        navigate(`/search?search=${search}`);
    }
})
const searchResult = ((result) => {
  if (result.trim()) {
      navigate(`/search?search=${result}`);
  }
})

//serach
const [songSearch, setSongSearch] = useState([]);
const [userSearch, setUserSearch] = useState([]);
const [combinedSearch, setCombinedSearch] = useState([]);
const [debouncedSearch, setDebouncedSearch] = useState(search); // Giá trị debounce

  // Debounce effect: chỉ cập nhật giá trị tìm kiếm sau 1s khi người dùng dừng nhập
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // Cập nhật giá trị debounce sau 1s
    }, 500);

    // Cleanup timeout khi component unmount hoặc khi `search` thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [search]); // Mỗi khi `search` thay đổi thì reset timeout

  // Effect thực hiện tìm kiếm khi giá trị debounce thay đổi
  useEffect(() => {
    if (debouncedSearch) {
      searchSong(debouncedSearch)
        .then((res) => {
          if (res.success) {
            setSongSearch(res.songs);
          } else {
            setSongSearch([]);
          }
        })
        .catch((err) => {
          console.error(err);
        });

      searchUser(debouncedSearch)
        .then((res) => {
          if (res.success) {
            setUserSearch(res.users);
          } else {
            setUserSearch([]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [debouncedSearch]); 


useEffect(() => {
  const combined = [...songSearch, ...userSearch];
  combined.sort((a, b) => {
      const nameA = a.title ? a.title.toLowerCase() : a.username.toLowerCase();
      const nameB = b.title ? b.title.toLowerCase() : b.username.toLowerCase();

      return nameA.localeCompare(nameB);
  });

  setCombinedSearch(combined);
}, [songSearch, userSearch]);

const goToOption = (option) => {
  if (option === 'profile') {
      navigate(`/profile/${usernameUnique}`);
  }else if(option === 'setting'){
    navigate(`/setting`);
  }
}

    const fomatTime = (time) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(time)) / 1000);

        if (diff < 60) {
            return `${diff} giây trước`;
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} phút trước`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} tiếng trước`;
        } else if (diff < 2592000) {
            const days = Math.floor(diff / 86400);
            return `${days} ngày trước`;
        } else if (diff < 31536000) {
            const months = Math.floor(diff / 2592000);
            return `${months} tháng trước`;
        } else {
            const years = Math.floor(diff / 31536000);
            return `${years} năm trước`;
        }
    }


  useEffect(() => {
    socket.on("followNoti", (data) => {
      console.log(`Bạn nhận được thông báo: ${data.message} đã theo dõi bạn!`);
      setNotification((prevNotification) => [...prevNotification, data.message]);
    });

    return () => {
      socket.off("followNoti");
    };
  }, []);

  const isHash = (string) => {
    return string.length === 24 && /^[0-9a-f]+$/.test(string);
  };

  const isUsername = (string) => {
    return !isHash(string);
  };
  const ClickSeen = (noti) => {
  
    seen(noti._id, UserNameUniqueLoined)
    setIsRender(true);
    if(noti.checkCmt)
      navigate(`/song/${noti.check}#${noti.checkCmt}`);
    else if(isHash(noti.check))
      navigate(`/song/${noti.check}`);
    else if(isUsername(noti.check))
      navigate(`/profile/${noti.check}`);

  }

  return (
    <div className={cx("Header")}>
      <Row className={cx("center")}>
        <Col xl="1" className={cx("Logo", "center")}>
          <Link to="/">
            <img
              className={cx("Logo-img")}
              src={logo}
              alt="Spotify Logo"
            />
          </Link>
        </Col>
        <Col xl="1" className={cx("center")}>
          <Link to="/" className={cx("")}>
            Home
          </Link>
        </Col>
        
        <Col xl="1" className={cx("center")}>
        <Link to="/feed">
          Feed
        </Link>
        </Col>
        
        <Col xl="4" className={cx("center")}>
          <span className={cx("Search")}>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchEnter();
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              onClick={searchEnter}
            />
            <div className={cx("Result-Search", search.length > 0 && isInputActive ?"Result-Search-active": "")}>
              <Row>
                {combinedSearch.length === 0 && (
                  <Col xl="12" className={cx("item-search")}>
                    <p><SearchOutlined /> Không tìm thấy kết quả</p>
                  </Col>
                )}
                {combinedSearch && combinedSearch.map((item) => (
                  <Col xl="12" className={cx("item-search")} onClick={() => searchResult(item.title || item.username)}>
                        <p> <SearchOutlined /> {item.title || item.username}</p>
                    </Col>
                ))}
              </Row>
              </div>
          </span>

        </Col>
        {logined && (
          <Col xl="5" className={cx("center")}>
            <Col xl="3" className={cx("center")}>
              <Link to="/library">
                Thư Viện
              </Link>
            </Col>
            
            <Col xl="4" className={cx("center")}>
              <Link to="/upload">Tải Nhạc Lên</Link>
            </Col>
            <Col xl="1" className={cx("center", "TB")}>
              <Popover 
                content={
                  <div className={cx("Prop-TB")}>
                    {notification?.map((noti, index) => (
                      <div key={index}>
                        {notification.length === 0 ? (
                          <div>Không có thông báo</div>
                        ) : (
                          <Row className={cx("item-TB")} onClick={() => ClickSeen(noti)}>
                            <Col xl='2'>
                              <img className={cx("avt-TB")} src={noti.avatar} alt="avt" />
                            </Col>
                            <Col className={cx("content-TB")}>
                              <span>{noti.content}</span>
                              <p>{fomatTime(noti.createdAt)}</p>
                            </Col>
                            {noti.seen === false && (
                              <Col xl='1' className={cx("seen")}>
                                <div className={cx("dot-seen")}></div>
                              </Col>
                            )}
                          </Row>
                        )}
                      </div>
                    ))}
                  </div>
                } 
                title="Thông Báo" 
                trigger="click"
              >
                {notification.filter(noti => !noti.seen).length > 0 && (
                  <div className={cx("number-TB")}>
                    {notification.filter(noti => !noti.seen).length}
                  </div>
                )}
                <BellOutlined className={cx("bell")} />
              </Popover>
            </Col>
            <Col xl="4" className={cx("user")}>
              <img className={cx("avt")} src={avt || "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"} alt="Profile" />
              <Dropdown>
                <Dropdown.Menu>
                  
                  <Dropdown.Item text="Trang Cá Nhân" onClick={() => goToOption("profile")}/>
               
                  <Dropdown.Item text="Cài Đặt" onClick={() => goToOption("setting")}/>
                  <Dropdown.Item text="Đăng Xuất" onClick={handleLogout} />
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Col>
        )}
        {!logined && (
          <Col xl="3" className={cx("center")}>
            <Col xl="4" className={cx("center")}>
              <button className={cx("signin")} onClick={handleLoginClick}>
                Sign in
              </button>
            </Col>
            <Col xl="8" className={cx("center")}>
              <button className={cx("signup")} onClick={handleRegisterClick}>
                Create account
              </button>
              {showRegister && (
                <div className={cx("popupRegister")}>
                  <Register clicker={openLogin} />
                </div>
              )}
              {showLogin && (
                <div className={cx("popupLogin")}>
                  <Login clickerRegister={openRegister} clickerVeryEmail={OpenVeryEmail}/>
                </div>
              )}
              {showRegister && (
                <div
                  className={cx("dong-background", "effmo")}
                  onClick={close}
                ></div>
              )}
              {showRePassoword && (
                <div className={cx("popupRegister")}>
                  <RePassword handleSubmit={close} />
                </div>
              )}
               {showVeryEmail && (
                <div className={cx("popupRegister")}>
                  <VeryEmail clickerSignin={openLogin} clickerRePass={OpenRePassowrd}/>
                </div>
              )}
              {showLogin && (
                <div className={cx("dong-background")} onClick={close}></div>
              )}
              {showRePassoword && (
                <div className={cx("dong-background")} onClick={close}></div>
              )}
            </Col>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default Header;
