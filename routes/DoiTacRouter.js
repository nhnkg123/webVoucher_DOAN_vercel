let express = require('express');
let router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    if (req.query.MaNganh) {
        const API_URL = `http://113.161.89.148:8081/api/doitac/doitacnganhhang?id=${req.query.MaNganh}`;

        axios.get(API_URL)
            .then(response => {

                res.render('DoiTac_grid', {
                    DSDoiTac: response.data
                });
            })
            .catch(error => {
                if (error) {
                    res.render('vouchers_grid', {
                        alert: {
                            message: 'Chưa có đối tác thuộc ngành hàng',
                            type: 'alert-danger'
                        }
                    });
                }
            });
    } else {
        const API_URL = "http://113.161.89.148:8081/api/doitac/dmdoitac";

        axios.get(API_URL)
            .then(response => {

                res.render('DoiTac_grid', {
                    DSDoiTac: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
});

router.get('/:id', (req, res) => {
    var ChiTietDoiTac;
    var DSChienDich;
    var SLCDDoiTac;
    var SLVoucherDoiTac;
    var VoucherCDNguoiDung;

    const API_URL = `http://113.161.89.148:8081/api/doitac/chitietdoitac?id=${req.params.id}`
        axios.get(API_URL)
            .then(response => {
                //lay chi tiet doi tac
                ChiTietDoiTac = response.data;
                const API_URL = `http://113.161.89.148:8081/api/chiendich/dmchiendichhienhoat?madoitac=${req.params.id}`;

                axios.get(API_URL)
                    .then(response => {
                        DSChienDich = response.data;
                        //Lay so luong chien dich cua Doi Tac
                        const API_URL = `http://113.161.89.148:8081/api/chiendich/soluongchiendichdoitac?madoitac=${req.params.id}`
                        axios.get(API_URL)
                            .then(response => {
                                ChiTietDoiTac.SLCDDoiTac = response.data.SoLuongChienDich;
                                //Lay So Luong Voucher cua Doi Tac
                                const API_URL = `http://113.161.89.148:8081/api/doitac/voucherphathanh?madoitac=${req.params.id}`
                                axios.get(API_URL)
                                    .then(response => {
                                        ChiTietDoiTac.SLVoucherDoiTac = response.data.SLVoucherDoiTac;
                                        // kiem tra SL Voucher Doi Tac neu >0 => hien thi
                                        if (response.data.SLVoucherDoiTac > 0) {
                                            const API_URL = `http://113.161.89.148:8081/api/voucher/vouchernguoidungtheodoitac?madoitac=${req.params.id}&manguoisohuu=${req.session.user.username}`
                                            axios.get(API_URL)
                                                .then(response => {
                                                    VoucherCDNguoiDung = response.data;
                                                    //Format lai ngay
                                                    VoucherCDNguoiDung.forEach((index, item) => {
                                                        ThoiHanTuFormat = `${new Date((VoucherCDNguoiDung[item].ThoiHanTu)).getDate()}-${new Date((VoucherCDNguoiDung[item].ThoiHanTu)).getMonth()+1}-${new Date((VoucherCDNguoiDung[item].ThoiHanTu)).getFullYear()}`;
                                                        VoucherCDNguoiDung[item].ThoiHanTuFormat = ThoiHanTuFormat;

                                                        ThoiHanDenFormat = `${new Date((VoucherCDNguoiDung[item].ThoiHanDen)).getDate()}-${new Date((VoucherCDNguoiDung[item].ThoiHanDen)).getMonth()+1}-${new Date((VoucherCDNguoiDung[item].ThoiHanDen)).getFullYear()}`;
                                                        VoucherCDNguoiDung[item].ThoiHanDenFormat = ThoiHanDenFormat;

                                                        VoucherCDNguoiDung[item].RandomString = RandomString();
                                                    })
                                                    console.log(VoucherCDNguoiDung);
                                                    res.render('DoiTac_single', {
                                                        ChiTietDoiTac: ChiTietDoiTac,
                                                        DSChienDich: DSChienDich,
                                                        VoucherCDNguoiDung: VoucherCDNguoiDung,
                                                    });
                                                })
                                                .catch(error => {
                                                    if (error) {
                                                        res.render('DoiTac_single', {
                                                            ChiTietDoiTac: ChiTietDoiTac,
                                                            DSChienDich: DSChienDich,
                                                        });
                                                    }
                                                });
                                        } else {
                                            //thong bao nguoi dung chua có voucher nào thuộc chiến dịch
                                            res.render('DoiTac_single', {
                                                ChiTietDoiTac: ChiTietDoiTac,
                                                DSChienDich: DSChienDich,
                                            });
                                        }
                                    })
                                    .catch(error => {
                                        ChiTietDoiTac.SLVoucherDoiTac = 0;
                                        res.render('DoiTac_single', {
                                            ChiTietDoiTac: ChiTietDoiTac,
                                            DSChienDich: DSChienDich,
                                        });
                                    });
                            })
                            .catch(error => {
                                ChiTietDoiTac.SLCDDoiTac = 0;
                                res.render('DoiTac_single', {
                                    ChiTietDoiTac: ChiTietDoiTac,
                                    DSChienDich: DSChienDich,
                                });
                            });
                    })
                    .catch(error => {
                        const API_URL = `http://113.161.89.148:8081/api/doitac/chitietdoitac?id=${req.params.id}`
                        axios.get(API_URL)
                            .then(response => {
                                ChiTietDoiTac = response.data;
                                ChiTietDoiTac.SLCDDoiTac = 0;
                                ChiTietDoiTac.SLVoucherDoiTac = 0;
                                res.render('DoiTac_single', {
                                    ChiTietDoiTac: ChiTietDoiTac
                                });
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });


            })
            .catch(error => {
                console.log(error);
            });

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