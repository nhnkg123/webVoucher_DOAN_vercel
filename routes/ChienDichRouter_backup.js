let express = require('express');
let router = express.Router();
let {conn, sql} = require('./connectSQL');
const axios = require('axios');

router.get('/', async(req, res) => {
    if (req.query.grid) {
        const API_URL = 'http://113.161.89.148:8081/api/chiendich/chiendich';

        axios.get(API_URL)
            .then(response => {
                res.render('ChienDich_grid', {
                    ChienDich: response.data
                });
            })
            .catch(error => {
                res.render('ChienDich_grid');
            });
    }

    if (req.query.list) {
        const API_URL = 'http://113.161.89.148:8081/api/chiendich/chiendich';

        axios.get(API_URL)
            .then(response => {
                res.render('ChienDich_list', {
                    ChienDich: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    
});

router.post('/', async(req, res) => {
    var ChienDich;
    var keyword = req.body.keyword;
    if (keyword == "") {
        const API_URL = 'http://113.161.89.148:8081/api/chiendich/chiendich';

        axios.get(API_URL)
            .then(response => {
                ChienDich = response.data;
                res.render('ChienDich_grid', {
                    ChienDich: ChienDich
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (keyword) {
        const API_URL = `http://113.161.89.148:8081/api/chiendich/chiendichtieude?tieude=${keyword}`;

        axios.get(API_URL)
            .then(response => {
                ChienDich = response.data;
                res.render('ChienDich_grid', {
                    ChienDich: ChienDich
                });
            })
            .catch(error => {
                res.locals.KhongTimDuoc = true;
                res.render('ChienDich_grid', {
                    alert: {
                        message: 'không tìm thấy chiến dịch',
                        type: 'alert-success'
                    }
                });
            });
    }

});

const getChiTietChienDich = () => {
    
};

router.get('/:id', async(req, res) => {
    const API_URL = `http://113.161.89.148:8081/api/chiendich/chiendichid?id=${req.params.id}`;
    var ChiTietChienDich;
    var DiemToiThieuNhanVoucher;
    var TongVoucherPHChienDich;
    var ThuTuLuotChoi;
    var TroChoiThuocChienDich;

    axios.get(API_URL)
        .then(response => {
            ChiTietChienDich = response.data[0];

            // Tra ve mang tro choi thuoc chien dich
            const API_URL = `http://113.161.89.148:8081/api/loaitrochoi/trochoitheochiendich?machiendich=${req.params.id}`;

            axios.get(API_URL)
                .then(response => {
                    ChiTietChienDich.LoaiTroChoi = response.data;
                    // neu so tra ve param score
                    if (req.query.score != null) {
                        if (req.session.user) {
                            
                            //KT Luot Choi
                            const API_URL = `http://113.161.89.148:8081/api/chitietchoi/thongtinluotchoi?machiendich=${req.params.id}&maloaitrochoi=${req.query.MaLoaiTro}&manguoidung=${req.session.user.username}`;

                            axios.get(API_URL)
                                .then(response => {
                                    if (response.data.SoLuotDaChoi < response.data.SoLuotChoiMacDinh) {
                                        ChiTietChienDich.ConLuotChoi = true;
                                        ThuTuLuotChoi = response.data.SoLuotDaChoi + 1;
                                        // Lay diem toi thieu trong Loai Tro Choi roi so sanh voi score vừa chơi
                                        const API_URL = `http://113.161.89.148:8081/api/chiendich/trochoitheochiendich?id=${req.query.MaLoaiTro}&machiendich=${req.params.id}`;
                                        
                                        axios.get(API_URL)
                                            .then(response => {
                                                TroChoiThuocChienDich = response.data;
                                                DiemToiThieuNhanVoucher = response.data.DiemToiThieuNhanVoucher;
                                                if (req.query.score >= DiemToiThieuNhanVoucher) {
                                                    ChiTietChienDich.DuDiem = true;
                                                    ChiTietChienDich.MaLoaiTro = req.query.MaLoaiTro;

                                                    // Tinh thời điểm phát hành Voucher và ngày hết hạn
                                                    var Day = new Date(Date.now()).getDate();
                                                    var Month = new Date(Date.now()).getMonth() + 1;
                                                    var Year = new Date(Date.now()).getFullYear();
                                                    ChiTietChienDich.NgayTao = `${Month}/${Day}/${Year}`;

                                                    var NextDate = getNextDay((Day + ChiTietChienDich.SoNgayHetHan), Month, Year);
                                                    console.log(NextDate);
                                                    console.log(ChiTietChienDich.SoNgayHetHan);
                                                    ChiTietChienDich.NgayHetHan = `${NextDate.getMonth()+1}/${NextDate.getDate()}/${NextDate.getFullYear()}`;;

                                                    // Tim so luong chien dich phat hanh bao nhieu loai voucher so sanh vơi so Voucher da cap phat
                                                    const API_URL = `http://113.161.89.148:8081/api/voucher/vouchercapphat?mavoucher=${ChiTietChienDich.MaLoaiVoucher}&machiendich=${req.params.id}`;
                                                    
                                                    axios.get(API_URL)
                                                        .then(response => {
                                                            if (response.data.SLCapPhat < response.data.SoLuong) {
                                                                ChiTietChienDich.ConVoucher = true

                                                                // Tao Chi Tiết Chơi Mới
                                                                const data = {
                                                                    MaNguoiDung: req.session.user.username,
                                                                    ThuTuLuotChoi: ThuTuLuotChoi,
                                                                    MaTroChoiThuocChienDich: TroChoiThuocChienDich.ID,
                                                                    DiemSo: req.query.score,
                                                                    MaVoucherPhatHanh: ChiTietChienDich.MaLoaiVoucher,
                                                                };

                                                                const headers = {
                                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                                    Authorization: `Bearer ${req.session.user.token}`,
                                                                };

                                                                axios.post('http://113.161.89.148:8081/api/chitietchoi/taochitietchoi', data, {
                                                                        headers
                                                                    })
                                                                    .then((response) => {
                                                                        res.render('ChienDich_single', {
                                                                            ChiTietChienDich: ChiTietChienDich
                                                                        });
                                                                    })
                                                                    .catch((error) => {
                                                                        console.log(error);
                                                                    });

                                                            } else {
                                                                // thong bao het loai voucher cho chien dich
                                                                ChiTietChienDich.HetVoucher = true;
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.log(error);
                                                        });

                                                } else {
                                                    ChiTietChienDich.MaLoaiTro = req.query.MaLoaiTro;
                                                    ChiTietChienDich.KhongDuDiem = true;
                                                    // van tao mới chi tiet choi vơi diem chua du
                                                    // Tao Chi Tiết Chơi Mới
                                                    const data = {
                                                        MaNguoiDung: req.session.user.username,
                                                        ThuTuLuotChoi: ThuTuLuotChoi,
                                                        MaTroChoiThuocChienDich: TroChoiThuocChienDich.ID,
                                                        DiemSo: req.query.score,
                                                        MaVoucherPhatHanh: ChiTietChienDich.MaLoaiVoucher,
                                                    };

                                                    const headers = {
                                                        'Content-Type': 'application/x-www-form-urlencoded',
                                                        Authorization: `Bearer ${req.session.user.token}`,
                                                    };

                                                    axios.post('http://113.161.89.148:8081/api/chitietchoi/taochitietchoi', data, {
                                                            headers
                                                        })
                                                        .then((response) => {
                                                            res.render('ChienDich_single', {
                                                                ChiTietChienDich: ChiTietChienDich
                                                            });
                                                        })
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                    } else {
                                        ChiTietChienDich.HetLuotChoi = true;
                                        res.render('ChienDich_single', {
                                            ChiTietChienDich: ChiTietChienDich
                                        });
                                    }
                                    
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        } else {
                            res.render('ChienDich_single', {
                                ChiTietChienDich: ChiTietChienDich
                            });
                        }
                    } else {
                        // khong tra ve score load trang
                        res.render('ChienDich_single', {
                            ChiTietChienDich: ChiTietChienDich
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });

        })
        .catch(error => {
            res.render('ChienDich_single', {
                alert: {
                    message: 'chưa có loại voucher nào cho chiến dịch này',
                    type: 'alert-danger'
                }
            });
        });
    
        // ham lay ngay tiep theo 
        function getNextDay (Day, Month, Year) {
            if (Month == 2) {
                if (NamNhuan(Year) == true) {
                    if (Day > 29) {
                        Day = Day - 29;
                        Month = Month + 1;
                    }
                } else {
                    if (Day > 28) {
                        Day = Day - 28;
                        Month = Month + 1;
                    }
                }
            }
            if(Month==1 || Month==3 || Month==5 || Month==7 || Month==8 || Month==10 || Month==12) {
                if (Day > 31) {
                    if (Month == 12) {
                        Day = Day - 31;
                        Month = 1;
                        Year = Year + 1;
                    } else {
                        Day = Day - 31;
                        Month = Month + 1;
                    }
                }
            }
            if(Month==4 || Month==6 || Month==9 || Month==11) {
                if (Day > 30) {
                    Day = Day - 30;
                    Month = Month + 1;
                }
            }
            return new Date(`${Year}-${Month}-${Day}`);
        }
        //ham KT nam nhuan
        function NamNhuan (year) {
            let isLeap = false;
            if(year % 4 == 0)//chia hết cho 4 là năm nhuận
            {
                if( year % 100 == 0)
                //nếu vừa chia hết cho 4 mà vừa chia hết cho 100 thì không phải năm nhuận
                {
                    if ( year % 400 == 0)//chia hết cho 400 là năm nhuận
                        isLeap = true;
                    else
                        isLeap = false;//không chia hết cho 400 thì không phải năm nhuận
                }
                else//chia hết cho 4 nhưng không chia hết cho 100 là năm nhuận
                    isLeap = true;
            }
            else {
                isLeap = false;
            }
            return isLeap;
        }
        

    /*
    var pool = await conn;
    var ChiTietChienDich;
    var sqlString = "select * from Chien_dich cd join Loai_voucher_theo_chien_dich vcd on (cd.MaChienDich = vcd.MaChienDich) join Loai_voucher lvc on (vcd.MaLoaiVoucher = lvc.MaLoai) where cd.MaChienDich = @id";
    return await pool.request()
        .input('id', sql.Int, req.params.id)
        .query(sqlString, async(err, data) => {
            ChiTietChienDich = data.recordset[0];

            var sqlString = "select * from Chien_dich cd join Tro_choi_thuoc_chien_dich tcd on (cd.MaChienDich = tcd.MaChienDich) join Loai_tro_choi ltc on (tcd.MaLoaiTroChoi = ltc.MaLoaiTro) where cd.MaChienDich = @id";
            return await pool.request()
                .input('id', sql.Int, req.params.id)
                .query(sqlString, async(err, data) => {
                    data.recordset.forEach((index, item) => {        
                        data.recordset[item].MoTaUrlGame = data.recordset[item].MoTa[1];
                    });
                    ChiTietChienDich.LoaiTroChoi = data.recordset;
                    var sqlString = "select * from Doi_tac dt join Chien_dich cd on (dt.MaDoiTac = cd.MaDoiTac) where cd.MaChienDich = @id";
                    return await pool.request()
                        .input('id', sql.Int, req.params.id)
                        .query(sqlString, async(err, data) => {
                            ChiTietChienDich.DoiTac = data.recordset[0];
                            // tìm diem toi thieu trong Loai Tro Choi roi so sanh voi score vừa chơi
                            if (req.query.score != null) {
                                //tao mới chi tiet choi (trigger tự cập nhật voucher)
                                console.log(req.session.user.username);
                                var sqlString = "SET IDENTITY_INSERT Chi_tiet_choi ON insert into Chi_tiet_choi(MaChiTiet, MaNguoiDung, ThuTuLuotChoi, MaTroChoiThuocChienDich, DiemSo, MaVoucherPhatHanh, NgayTao, NgayUpdate) values (@MaChiTiet, @MaNguoiDung, @ThuTuLuotChoi, @MaTroChoiThuocChienDich, @DiemSo, @MaVoucherPhatHanh, @NgayTao, @NgayUpdate)";
                                return await pool.request()
                                    .input('MaChiTiet', sql.Int, 1)
                                    .input('MaNguoiDung', sql.VarChar, req.session.user.username)
                                    .input('ThuTuLuotChoi', sql.Int, 1)
                                    .input('MaTroChoiThuocChienDich', sql.Int, req.query.MaLoaiTro)
                                    .input('DiemSo', sql.Int, req.query.score)
                                    .input('MaVoucherPhatHanh', sql.Int, null)
                                    .input('NgayTao', sql.Date, Date.Now)
                                    .input('NgayUpdate', sql.Date, Date.Now)
                                    .query(sqlString, async (err, data) => {
                                        console.log(err);
                                        // kiem tra du diem khong
                                        var sqlString = "select * from Tro_choi_thuoc_chien_dich where MaLoaiTroChoi = @id and MaChienDich = @MaCD";
                                        return await pool.request()
                                            .input('id', sql.Int, req.query.MaLoaiTro)
                                            .input('MaCD', sql.Int, req.params.id)
                                            .query(sqlString, async (err, data) => {
                                                if (data.recordset[0] != null) {
                                                    if (req.query.score >= data.recordset[0].DiemToiThieuNhanVoucher) {
                                                        ChiTietChienDich.DuDiem = true;
                                                        // da du diem => tim voucher vua them xuat ma + chuyen huong qua trang /vouchers de hien thi voucher voi ma duoc truyen qua
                                                        var sqlString = "select * from Voucher where MaLoaiTroChoi = @id and MaChienDich = @MaCD";
                                                        return await pool.request()
                                                            .input('id', sql.Int, req.query.MaLoaiTro)
                                                            .input('MaCD', sql.Int, req.params.id)
                                                            .query(sqlString, async (err, data) => {

                                                            });

                                                    } else {
                                                        ChiTietChienDich.KhongDuDiem = true;
                                                    }
                                                }
                                                res.render('ChienDich_single', {
                                                    ChiTietChienDich: ChiTietChienDich
                                                });
                                            });

                                

                                        
                                        // cac loi van con:
                                        // sau khi thêm chi tiết chơi query voucher theo ma chi tiết choi => co Voucher mong muốn => chuyen huong ve /vouchers hiển thị lên chiết vouchers luôn
                                        // hoac chi can dung manguoichoi, chien dich, ma tro choi vừa luu chi tiet choi de tim Voucher mới tạo => chuyen hướng /vouchers bật sẵn chi tiết voucher mới t
                                        // ma voucher cap lay o dau
                                    });
                            } else {
                                res.render('ChienDich_single', {
                                    ChiTietChienDich: ChiTietChienDich
                                });
                            }
                            
                            
                        });
                });
        });
        */
});




module.exports = router;