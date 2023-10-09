let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
const axios = require('axios');


router.get('/login', (req, res) => {
    res.render('signin');
});

router.post('/login', async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let keepLoggedIn = req.body.keepLoggedIn;

    //kiem tra user ton tai
    const API_URL = `http://113.161.89.148:8081/api/thongtindangnhap/kiemtrauser?username=${username}`;

    axios.get(API_URL)
    .then(response => {
        //kiem tra nguoi dung ton tai
        if (response.data) {
            //kiem tra password
            const data = {
                Username: username,
                Password: password,
                Role: '3',
            };
              
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
              
            axios.post('http://113.161.89.148:8081/api/thongtindangnhap/dangnhap', data, { headers })
                .then((response) => {
                    if (keepLoggedIn) {
                        req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : null;
                        let user = {
                            username: username,
                            password: password,
                            role: response.data.Role,
                            token: response.data.Token
                        };
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        let user = {
                            username: username,
                            password: password,
                            role: response.data.Role,
                            token: response.data.Token
                        };
                        req.session.user = user;
                        res.redirect('/');
                    }
                })
                .catch((error) => {
                    if (error) {
                        res.render('signin', {userinfor: {
                                message: 'Nhập sai password!',
                                type: 'alert-danger'
                            }
                        });
                    }
                });
        }
    })
    .catch(error => {
        if (error) {
            res.render('signin', {
                userinfor: {
                    message: 'Username không tồn tại!',
                    type: 'alert-danger'
                }
            });
        }
    });
    
});

router.get('/register', (req, res) => {
    res.render('signup');
});

router.post('/register', async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let email = req.body.email;
    let address = req.body.address;
    let agreeTerms = req.body.agreeTerms;
    let keepLoggedIn = req.body.keepLoggedIn;

    //var salt = bcrypt.genSaltSync(10);
    //password = bcrypt.hashSync(password, salt);

    //kiem tra confirm password va password giong nhau
    if (password != confirmPassword) {
        res.render('signup', {userinfor: {
                message: 'Confirm password không giống password!',
                type: 'alert-danger'
            }
        });
    }
    if (agreeTerms) {
        //kiem tra user ton tai
        const API_URL = `http://113.161.89.148:8081/api/thongtindangnhap/kiemtrauser?username=${username}`;

        axios.get(API_URL)
            .then(response => {
                //kiem tra nguoi dung ton tai
                if (response.data) {
                    //nguoi dung da ton tai => thong bao
                    res.render('signup', {
                        userinfor: {
                            message: 'User đã tồn tại! Vui lòng chọn username khác',
                            type: 'alert-danger'
                        }
                    });
                }
            })
            .catch(error => {
                if (error) {
                    //dang ky 
                    const data = {
                        Username: username,
                        Password: password,
                        imgPath: "",
                        DiaChi: address,
                        Email: email
                    };
                      
                    const headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                      
                    axios.post('http://113.161.89.148:8081/api/thongtindangnhap/nguoidungdangky', data, { headers })
                        .then((response) => {
                            if (keepLoggedIn) {
                                req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : null;
                                let user = {
                                    username: username,
                                    password: password,
                                };
                                req.session.user = user;
                                res.redirect('/');
                            } else {
                                res.render('signup', {
                                    userinfor: {
                                        message: `You have registered, now please <a color="blue" href = "/users/login">Sign in</a>`,
                                        type: 'alert-success',
                                    }
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            });
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
             return next(error);   
        }
        return res.redirect('/users/login');
    });
});

module.exports = router;