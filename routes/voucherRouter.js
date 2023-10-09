let express = require('express');
let router = express.Router();
const axios = require('axios');
let ShareIDVoucher;

router.get('/', (req, res) => {
    if (req.query.IDVoucher) {
        ShareIDVoucher = req.query.IDVoucher;
    }
    
    if (req.session.user) {
        var ThoiHanTuFormat;
        var ThoiHanDenFormat;
        var vouchers;

        if (req.query.sort) {
            const API_URL = `http://113.161.89.148:8081/api/voucher/ngayphathanhvouchernguoidung?manguoisohuu=${req.session.user.username}`;

            axios.get(API_URL)
                .then(response => {
                    vouchers = response.data;
                    vouchers.forEach((index, item) => {
                        ThoiHanTuFormat = `${new Date((vouchers[item].ThoiHanTu)).getDate()}-${new Date((vouchers[item].ThoiHanTu)).getMonth()+1}-${new Date((vouchers[item].ThoiHanTu)).getFullYear()}`;
                        vouchers[item].ThoiHanTuFormat = ThoiHanTuFormat;

                        ThoiHanDenFormat = `${new Date((vouchers[item].ThoiHanDen)).getDate()}-${new Date((vouchers[item].ThoiHanDen)).getMonth()+1}-${new Date((vouchers[item].ThoiHanDen)).getFullYear()}`;
                        vouchers[item].ThoiHanDenFormat = ThoiHanDenFormat;
                    })

                    res.render('vouchers_grid', {
                        vouchers: vouchers
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            const API_URL = `http://113.161.89.148:8081/api/voucher/dmvouchernguoidung?manguoisohuu=${req.session.user.username}`;

            axios.get(API_URL)
                .then(response => {
                    vouchers = response.data;
                    vouchers.forEach((index, item) => {
                        ThoiHanTuFormat = `${new Date((vouchers[item].ThoiHanTu)).getDate()}-${new Date((vouchers[item].ThoiHanTu)).getMonth()+1}-${new Date((vouchers[item].ThoiHanTu)).getFullYear()}`;
                        vouchers[item].ThoiHanTuFormat = ThoiHanTuFormat;

                        ThoiHanDenFormat = `${new Date((vouchers[item].ThoiHanDen)).getDate()}-${new Date((vouchers[item].ThoiHanDen)).getMonth()+1}-${new Date((vouchers[item].ThoiHanDen)).getFullYear()}`;
                        vouchers[item].ThoiHanDenFormat = ThoiHanDenFormat;

                        vouchers[item].RandomString = RandomString();
                    })

                    res.locals.pagination = {
                        page: parseInt(req.query.page),
                        limit: parseInt(req.query.limit),
                        totalRows: response.data.length,
                    };
                    res.render('vouchers_grid', {
                        vouchers: vouchers
                    });
                })
                .catch(error => {
                    if (error) {
                        res.render('vouchers_grid', {
                            alert: {
                                message: 'Bạn chưa có Voucher nào',
                                type: 'alert-success'
                            }
                        });
                    }
                });
        }
    } else {
        res.render('vouchers_grid', {
            alert: {
                message: 'Bạn cần đăng nhập để xem danh sách Voucher',
                type: 'alert-danger'
            }
        });
    }


    
    function RandomString (){
        // choose a Character random from this String
        let AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "0123456789" +
            "abcdefghijklmnopqrstuvxyz";

        // create StringBuffer size of AlphaNumericString
        var arrStr = new String();

        for (let i = 0; i < 20; i++) {

            // generate a random number between
            // 0 to AlphaNumericString variable length
            let index
                = AlphaNumericString.length *
                    Math.random();

            // add Character one by one in end of sb
            arrStr += AlphaNumericString
                .charAt(index);
        }

        return arrStr;
    }

    

    




    //////////////////////////////
    //Tim vouchers theo Doi Tac bi sai (dang tim ra user = null) API 12
    // chua sort duoc list voucher => co the xoa luon
    //có cần làm phân trang không
    // ds voucher hiện trang index can loc theo user
    
});

router.post ('/', (req, res) => {
    if (req.session.user) {
        var ThoiHanTuFormat;
        var ThoiHanDenFormat;
        var vouchers;
        var ShareUser;

        if (req.query.sort) {
            const API_URL = `http://113.161.89.148:8081/api/voucher/ngayphathanhvouchernguoidung?manguoisohuu=${req.session.user.username}`;

            axios.get(API_URL)
                .then(response => {
                    vouchers = response.data;
                    vouchers.forEach((index, item) => {
                        ThoiHanTuFormat = `${new Date((vouchers[item].ThoiHanTu)).getDate()}-${new Date((vouchers[item].ThoiHanTu)).getMonth()+1}-${new Date((vouchers[item].ThoiHanTu)).getFullYear()}`;
                        vouchers[item].ThoiHanTuFormat = ThoiHanTuFormat;

                        ThoiHanDenFormat = `${new Date((vouchers[item].ThoiHanDen)).getDate()}-${new Date((vouchers[item].ThoiHanDen)).getMonth()+1}-${new Date((vouchers[item].ThoiHanDen)).getFullYear()}`;
                        vouchers[item].ThoiHanDenFormat = ThoiHanDenFormat;
                    })

                    res.render('vouchers_grid', {
                        vouchers: vouchers
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            const API_URL = `http://113.161.89.148:8081/api/voucher/dmvouchernguoidung?manguoisohuu=${req.session.user.username}`;

            axios.get(API_URL)
                .then(response => {
                    vouchers = response.data;
                    vouchers.forEach((index, item) => {
                        ThoiHanTuFormat = `${new Date((vouchers[item].ThoiHanTu)).getDate()}-${new Date((vouchers[item].ThoiHanTu)).getMonth()+1}-${new Date((vouchers[item].ThoiHanTu)).getFullYear()}`;
                        vouchers[item].ThoiHanTuFormat = ThoiHanTuFormat;

                        ThoiHanDenFormat = `${new Date((vouchers[item].ThoiHanDen)).getDate()}-${new Date((vouchers[item].ThoiHanDen)).getMonth()+1}-${new Date((vouchers[item].ThoiHanDen)).getFullYear()}`;
                        vouchers[item].ThoiHanDenFormat = ThoiHanDenFormat;

                        vouchers[item].RandomString = RandomString();
                    })
                    // neu có Share thuc hien share
                    if (req.body.ShareUsername) {
                        // kiểm tra username ton tai
                        const API_URL = `http://113.161.89.148:8081/api/thongtindangnhap/kiemtrauser?username=${req.body.ShareUsername}`;

                        axios.get(API_URL)
                            .then(response => {
                                if (response.data) {
                                    ShareUser = response.data;
                                    //share voucher
                                    const data = {};

                                    const headers = {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        Authorization: `Bearer ${req.session.user.token}`,
                                    };

                                    axios.post(`http://113.161.89.148:8081/api/voucher/tangvoucher?idvoucher=${ShareIDVoucher}&manguoisohuu=${req.body.ShareUsername}&mailnguoisohuu=${ShareUser.Email}&manguoitang=${req.session.user.username}`, data, {
                                            headers
                                        })
                                        .then((response) => {
                                            console.log("share thành công");
                                            // khi tang thanh cong load lai voucher mot lan nua
                                            const API_URL = `http://113.161.89.148:8081/api/voucher/dmvouchernguoidung?manguoisohuu=${req.session.user.username}`;

                                            axios.get(API_URL)
                                                .then(response => {
                                                    vouchers = response.data;
                                                    vouchers.forEach((index, item) => {
                                                        ThoiHanTuFormat = `${new Date((vouchers[item].ThoiHanTu)).getDate()}-${new Date((vouchers[item].ThoiHanTu)).getMonth()+1}-${new Date((vouchers[item].ThoiHanTu)).getFullYear()}`;
                                                        vouchers[item].ThoiHanTuFormat = ThoiHanTuFormat;

                                                        ThoiHanDenFormat = `${new Date((vouchers[item].ThoiHanDen)).getDate()}-${new Date((vouchers[item].ThoiHanDen)).getMonth()+1}-${new Date((vouchers[item].ThoiHanDen)).getFullYear()}`;
                                                        vouchers[item].ThoiHanDenFormat = ThoiHanDenFormat;

                                                        vouchers[item].RandomString = RandomString();
                                                    })

                                                    res.render('vouchers_grid', {
                                                        vouchers: vouchers
                                                    });
                                                })
                                                .catch(error => {
                                                    if (error) {
                                                        res.render('vouchers_grid', {
                                                            alert: {
                                                                message: 'Bạn chưa có Voucher nào',
                                                                type: 'alert-success'
                                                            }
                                                        });
                                                    }
                                                });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                            })
                            .catch(error => {
                                if (error) {
                                    res.render(`vouchers_grid`, {
                                        UsernameNotExist: {
                                            message: 'Username không tồn tại!',
                                            type: 'alert-danger'
                                        }
                                    });
                                }
                            });



                        
                    } else {
                        res.render('vouchers_grid', {
                            vouchers: vouchers
                        });
                    }

                })
                .catch(error => {
                    if (error) {
                        res.render('vouchers_grid', {
                            alert: {
                                message: 'Bạn chưa có Voucher nào',
                                type: 'alert-success'
                            }
                        });
                    }
                });
        }
    } else {
        res.render('vouchers_grid', {
            alert: {
                message: 'Bạn cần đăng nhập để xem danh sách Voucher',
                type: 'alert-danger'
            }
        });
    }


    
    function RandomString (){
        // choose a Character random from this String
        let AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "0123456789" +
            "abcdefghijklmnopqrstuvxyz";

        // create StringBuffer size of AlphaNumericString
        var arrStr = new String();

        for (let i = 0; i < 20; i++) {

            // generate a random number between
            // 0 to AlphaNumericString variable length
            let index
                = AlphaNumericString.length *
                    Math.random();

            // add Character one by one in end of sb
            arrStr += AlphaNumericString
                .charAt(index);
        }

        return arrStr;
    }
});

module.exports = router;