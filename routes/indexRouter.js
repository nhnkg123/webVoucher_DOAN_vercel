let express = require('express');
let router = express.Router();
//let {conn, sql} = require('./connectSQL');
const axios = require('axios');

router.get('/', (req, res) => {
    if (req.body.ShareUsername) {
        console.log(req.body.ShareUsername);
    }
    var ChienDich;
    var category;
    var DoiTac;

    const API_URL = 'http://113.161.89.148:8081/api/chiendich/chiendichasc';
    axios.get(API_URL)
        .then(response => {
            ChienDich = response.data;
            // lay Danh muc nganh hang
            if (req.session.user) {
                const token = req.session.user.token;
        
                axios.get('http://113.161.89.148:8081/api/nganhhang/dmnganhhang', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        category = response.data;
                        // lay danh sach Doi Tac
                        const API_URL = 'http://113.161.89.148:8081/api/doitac/dmdoitac';
                            axios.get(API_URL)
                                .then(response => {
                                    DoiTac = response.data;

                                    // lay danh sach Voucher moi nhat
                                    const API_URL = `http://113.161.89.148:8081/api/voucher/ngayphathanhvouchernguoidung?manguoisohuu=${req.session.user.username}`;
                                    axios.get(API_URL)
                                        .then(response => {
                                            NewVoucher = response.data;
                                            //Format lai ngay
                                            NewVoucher = response.data;
                                            NewVoucher.forEach((index, item) => {
                                                ThoiHanTuFormat = `${new Date((NewVoucher[item].ThoiHanTu)).getDate()}-${new Date((NewVoucher[item].ThoiHanTu)).getMonth()+1}-${new Date((NewVoucher[item].ThoiHanTu)).getFullYear()}`;
                                                NewVoucher[item].ThoiHanTuFormat = ThoiHanTuFormat;

                                                ThoiHanDenFormat = `${new Date((NewVoucher[item].ThoiHanDen)).getDate()}-${new Date((NewVoucher[item].ThoiHanDen)).getMonth()+1}-${new Date((NewVoucher[item].ThoiHanDen)).getFullYear()}`;
                                                NewVoucher[item].ThoiHanDenFormat = ThoiHanDenFormat;
                                            })

                                            res.render('index', {
                                                ChienDich: ChienDich,
                                                category: category,
                                                DoiTac: DoiTac,
                                                NewVoucher: response.data,
                                            });
                                        })
                                        .catch(error => {
                                            if (error) {
                                                res.render('index', {
                                                    ChienDich: ChienDich,
                                                    category: category,
                                                    DoiTac: DoiTac,
                                                });
                                            }
                                        });
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                res.render('index', {
                    ChienDich: ChienDich, 
                    category: response.data
                });
            }
        })
        .catch(error => {
            if (error) {
                res.render('index');
            }
        });


        

});

module.exports = router;

