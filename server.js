import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const salt = 10;
let userEmail = "";
let bookisbn = "";
let currentkosarid = 0;

const app = express();
app.use(cors({
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET"],
        credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//connection pool
async function run() {
    try {
        await oracledb.createPool({
            user : "C##HBV23R",
            password : "alma123",
            connectString : "localhost:1521/FREE"
        });

    } catch (err) {
        console.error(err.message);
    }
}

run();

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({status: "noauth",Error: "You are not authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({Error: "Token is not okay"});
            } else {
                req.email = decoded.email;
                userEmail = decoded.email;
                next();
            }
        })
    }
}

app.get("/", verifyUser ,(req, res) => {
    async function adminCheck() {
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM ADMIN WHERE EMAIL = :email",{email:req.email});

            //osszetett lekerdezes #3
            const legaktivabb_user = await connection.execute("SELECT kosar.vasarlo, keresztnev, vezeteknev, count(*) FROM kosar, vasarlo WHERE kosar.vasarlo = vasarlo.email AND kosar.ALLAPOT = 1 GROUP BY vasarlo, keresztnev, vezeteknev ORDER BY count(*) DESC");

            //osszetett lekerdezes #4
            const legeladottabb_book = await connection.execute("SELECT kiadvany.isbn, cim, SUM(darab) FROM kiadvany, kosar_tartalma, kosar WHERE kiadvany.isbn = kosar_tartalma.isbn AND kosar_tartalma.id = kosar.id AND kosar.allapot = 1 GROUP BY kiadvany.isbn, kiadvany.cim ORDER BY SUM(darab) DESC");

            await connection.close();

            if (result.rows.length === 1) {
                return res.json({Status: "Success", email: req.email, admin: true, legaktivabb: legaktivabb_user.rows[0], legeladottabb: legeladottabb_book.rows[0]});
            } else {
                return res.json({Status: "Success", email: req.email, admin: false});
            }

        } catch (err) {
            console.log(err);
        }
    }

    adminCheck();
})

app.post("/signup", (req, res) => {
    async function signup(){
        try {
            let connection = await oracledb.getConnection();
            connection.close();

            if (req.body.email.length < 1 || req.body.email.length > 100) {
                return res.json({status: "failed",message: "Email is too short or too long."});
            }

            const result = await connection.execute("SELECT * FROM FELHASZNALO WHERE EMAIL = :email",{email:req.body.email});
            if (result.rows.length === 1) {
                return res.json({status: "failed", message: "Email is already in use."});
            }

            if (req.body.vezeteknev.length < 1 || req.body.vezeteknev.length > 30) {
                return res.json({status: "failed",message: "Vezeteknev is too short or too long."});
            }

            if (req.body.keresztnev.length < 1 || req.body.keresztnev.length > 20) {
                return res.json({status: "failed",message: "Keresztnev is too short or too long."});
            }

            if (req.body.iranyitoszam.toString().length !== 4) {
                return res.json({status: "failed",message: "Iranyitoszam is wrong."});
            }

            if (req.body.utca.length < 1 || req.body.utca.length > 30) {
                return res.json({status: "failed",message: "Utca is too short or too long."});
            }

            if (req.body.hazszam.toString().length < 1) {
                return res.json({status: "failed",message: "Hazszam is empty."});
            }

            if (req.body.telefonszam.toString().length !== 11) {
                return res.json({status: "failed",message: "Telefonszam is wrong."});
            }

            if (req.body.jelszo.length < 1 || req.body.jelszo.length > 20) {
                return res.json({status: "failed",message: "Jelszo is too short or too long."});
            }

            if (req.body.jelszoUjra.length < 1 || req.body.jelszoUjra.length > 20) {
                return res.json({status: "failed",message: "Jelszo újra is too short or too long."});
            }

            if (req.body.jelszo !== req.body.jelszoUjra) {
                return res.json({status: "failed",message: "The passwords don't match."});
            }

            const hashedJelszo = await bcrypt.hash(req.body.jelszo, salt);

            let connection2 = await oracledb.getConnection();

            await connection2.execute("INSERT INTO FELHASZNALO VALUES (:email,:jelszo)",{email:req.body.email,jelszo:hashedJelszo});
            await connection2.execute("INSERT INTO VASARLO VALUES (:email,:vezeteknev,:keresztnev,:iranyitoszam,:utca,:hazszam,:telefonszam,0)",{email:req.body.email,vezeteknev:req.body.vezeteknev,keresztnev:req.body.keresztnev,iranyitoszam:parseInt(req.body.iranyitoszam),utca:req.body.utca,hazszam:parseInt(req.body.hazszam),telefonszam:parseInt(req.body.telefonszam)});
            await connection2.commit();
            await connection2.close();

            res.clearCookie("token");

            return res.json({status: "success",message:"successful signup"});

        } catch (err) {
            console.log(err);
        }
    }

    signup();
})

app.post("/login", (req, res) => {
    async function login(){
        try {
            let connection = await oracledb.getConnection();
            connection.close();

            if (req.body.email.length < 1 || req.body.email.length > 100) {
                return res.json({status: "failed",message: "Email is too short or too long."});
            }

            if (req.body.jelszo.length < 1 || req.body.jelszo.length > 20) {
                return res.json({status: "failed",message: "Jelszo is too short or too long."});
            }

            if (req.body.jelszoUjra.length < 1 || req.body.jelszoUjra.length > 20) {
                return res.json({status: "failed",message: "Jelszo újra is too short or too long."});
            }

            if (req.body.jelszo !== req.body.jelszoUjra) {
                return res.json({status: "failed",message: "The passwords don't match."});
            }

            let connection2 = await oracledb.getConnection();
            const result = await connection2.execute("SELECT * FROM FELHASZNALO WHERE EMAIL = :email",{email:req.body.email});
            await connection2.close();

            if (result.rows.length === 1) {
                const storedPassword = result.rows[0][1];
                bcrypt.compare(req.body.jelszo, storedPassword, (err, isMatch) => {
                    if (err) return res.json({status: "failed"});
                    if (isMatch) {
                        const email = result.rows[0][0];
                        const token = jwt.sign({email}, "jwt-secret-key", {expiresIn: "1d"});
                        res.cookie("token",token);
                        return res.json({status: "success"});
                    } else {
                        return res.json({status: "failed"});
                    }
                })
            } else {
                return res.json({status: "failed"});
            }

        } catch (err) {
            console.log(err);
        }
    }

    login();
})

app.post("/addBooks", (req, res) => {
    async function addBooks(){
        try {
            let connection = await oracledb.getConnection();

            if (req.body.isbn.length !== 13) {
                await connection.close();
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const check = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.isbn});
            await connection.close();
            if (check.rows.length === 1) {
                return res.json({status: "failed",message:"Book is already in the database."});
            }

            if (req.body.cim.length < 1 || req.body.cim.length > 50) {
                return res.json({status: "failed", message: "Cim is empty or too long."});
            }

            if (req.body.kiado.length < 1 || req.body.kiado.length > 50) {
                return res.json({status: "failed", message: "Kiado is empty or too long."});
            }

            if (req.body.kiadasEve < 1 || req.body.kiadasEve > 2025) {
                return res.json({status: "failed", message: "Kiadas is wrong."});
            }

            if (req.body.nyelv.length < 1 || req.body.nyelv.length > 20) {
                return res.json({status: "failed", message: "Nyelv is empty or too long."});
            }

            if (req.body.ar < 0) {
                return res.json({status: "failed", message: "Ar nem lehet negativ."});
            }

            if (req.body.ismerteto.length < 1 || req.body.ismerteto.length > 300) {
                return res.json({status: "failed", message: "Ismerteto is empty or too long."});
            }

            if (req.body.elerhetoDb < 0) {
                return res.json({status: "failed", message: "Elerheto darab nem lehet negativ."});
            }

            if (req.body.szerzok.length < 1) {
                return res.json({status: "failed", message: "Szerzok is empty."});
            }

            if (req.body.mufajok.length < 1) {
                return res.json({status: "failed", message: "Mufajok is empty."});
            }

            if (req.body.formatum.length > 20) {
                return res.json({status: "failed", message: "Formaum is too long."});
            }

            if (req.body.hossz > 99999) {
                return res.json({status: "failed", message: "Hossz is too long."});
            }

            function normalizeText(input) {
                return input
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "");
            }

            const kepurl = "../../../images/" + normalizeText(req.body.cim)  + ".png";

            let connection2 = await oracledb.getConnection();

            await connection2.execute("INSERT INTO KIADVANY VALUES (:isbn,:cim,:kiado,:kiadasEve,:nyelv,:ar,:ismerteto,:elerhetoDb,:adminEmail,:kep)",{isbn:req.body.isbn,cim:req.body.cim,kiado:req.body.kiado,kiadasEve:req.body.kiadasEve,nyelv:req.body.nyelv,ar:req.body.ar,ismerteto:req.body.ismerteto,elerhetoDb:req.body.elerhetoDb,adminEmail:userEmail,kep:kepurl});

            if (req.body.formatum.length > 0) {
                await connection2.execute("INSERT INTO E_KONYV VALUES (:isbn,:formatum)",{isbn:req.body.isbn,formatum:req.body.formatum});
            }

            if (req.body.hossz > 0) {
                await connection2.execute("INSERT INTO HANGOSKONYV VALUES (:isbn,:hossz)",{isbn:req.body.isbn,hossz:req.body.hossz});
            }

            const szerzok = req.body.szerzok.split(", ");
            for (let szerzo in szerzok) {
                await connection2.execute("INSERT INTO SZERZO VALUES (:isbn,:szerzoneve)",{isbn:req.body.isbn,szerzoneve:szerzok[szerzo]});
            }

            const mufajok = req.body.mufajok.split(", ");
            for (let mufaj in mufajok) {
                await connection2.execute("INSERT INTO MUFAJ VALUES (:isbn,:mufajneve)",{isbn:req.body.isbn,mufajneve:mufajok[mufaj]});
            }

            await connection2.commit();
            await connection2.close();

            return res.json({status: "success", message:"Successfully added"});
        } catch (err) {
            console.log(err);
        }
    }

    addBooks();
})

app.post("/deleteBooks", (req, res) => {
    async function deleteBook() {
        try {
            let connection = await oracledb.getConnection();

            if (req.body.delisbn.length !== 13) {
                await connection.close();
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const result = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.delisbn});
            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({status: "failed", message: "Book not found."});
            }

            await connection.execute("DELETE FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.delisbn});

            await connection.commit();
            await connection.close();

            return res.json({status: "success", message: "Book was deleted successfully"});
        } catch (err) {
            console.log(err);
        }
    }

    deleteBook();
})

app.post("/searchBooks", (req, res) => {
    async function searchBooks() {
        try {
            let connection = await oracledb.getConnection();

            if (req.body.searchisbn.length !== 13) {
                await connection.close();
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const result = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({status: "failed", message: "Book not found."});
            }

            let m_szerzok = "";
            const resultSzerzok = await connection.execute("SELECT * FROM SZERZO WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            for (let i=0; i<resultSzerzok.rows.length-1; i++) {
                m_szerzok += resultSzerzok.rows[i][1];
                m_szerzok += ", ";
            }
            m_szerzok += resultSzerzok.rows[resultSzerzok.rows.length-1][1];

            let m_mufajok = "";
            const resultMufajok = await connection.execute("SELECT * FROM MUFAJ WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            for (let i=0; i<resultMufajok.rows.length-1; i++) {
                m_mufajok += resultMufajok.rows[i][1];
                m_mufajok += ", ";
            }
            m_mufajok += resultMufajok.rows[resultMufajok.rows.length-1][1];

            let m_isbn = result.rows[0][0];
            let m_cim = result.rows[0][1];
            let m_kiado = result.rows[0][2];
            let m_kiadasEve = result.rows[0][3];
            let m_nyelv = result.rows[0][4];
            let m_ar = result.rows[0][5];
            let m_ismerteto = result.rows[0][6];
            let m_elerhetoDb = result.rows[0][7];
            let m_formatum = "";
            let m_hossz = 0;

            const resultFormatum = await connection.execute("SELECT * FROM E_KONYV WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            if (resultFormatum.rows.length === 1) {
                m_formatum = resultFormatum.rows[0][1];
            }

            const resultHossz = await connection.execute("SELECT * FROM HANGOSKONYV WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            if (resultHossz.rows.length === 1) {
                m_hossz = resultHossz.rows[0][1];
            }

            await connection.close();

            return res.json({status: "success", message: "Book found",isbn:m_isbn,cim:m_cim,szerzok:m_szerzok,mufajok:m_mufajok,kiado:m_kiado,kiadasEve:m_kiadasEve,nyelv:m_nyelv,ar:m_ar,ismerteto:m_ismerteto,elerhetoDb:m_elerhetoDb,formatum:m_formatum,hossz:m_hossz});
        } catch (err) {
            console.log(err);
        }
    }

    searchBooks();
})

app.post("/modifyBooks", (req, res) => {
    async function modifyBooks(){
        try {
            let connection = await oracledb.getConnection();
            await connection.close();

            if (req.body.cim.length < 1 || req.body.cim.length > 50) {
                return res.json({status: "failed", message: "Cim is empty or too long."});
            }

            if (req.body.kiado.length < 1 || req.body.kiado.length > 50) {
                return res.json({status: "failed", message: "Kiado is empty or too long."});
            }

            if (req.body.kiadasEve < 0 || req.body.kiadasEve > 2025) {
                return res.json({status: "failed", message: "Kiadas is wrong."});
            }

            if (req.body.nyelv.length < 1 || req.body.nyelv.length > 20) {
                return res.json({status: "failed", message: "Nyelv is empty or too long."});
            }

            if (req.body.ar < 0) {
                return res.json({status: "failed", message: "Ar nem lehet negativ."});
            }

            if (req.body.ismerteto.length < 1 || req.body.ismerteto.length > 300) {
                return res.json({status: "failed", message: "Ismerteto is empty or too long."});
            }

            if (req.body.elerhetoDb < 0) {
                return res.json({status: "failed", message: "Elerheto darab nem lehet negativ."});
            }

            if (req.body.szerzok.length < 1) {
                return res.json({status: "failed", message: "Szerzok is empty."});
            }

            if (req.body.mufajok.length < 1) {
                return res.json({status: "failed", message: "Mufajok is empty."});
            }

            if (req.body.formatum.length > 20) {
                return res.json({status: "failed", message: "Formaum is too long."});
            }

            if (req.body.hossz > 99999) {
                return res.json({status: "failed", message: "Hossz is too long."});
            }

            let connection2 = await oracledb.getConnection();

            await connection2.execute("UPDATE KIADVANY SET CIM = :cim,KIADO = :kiado,KIADAS_EVE = :kiadasEve,NYELV = :nyelv,AR = :ar,ISMERTETO = :ismerteto, ELERHETO_DB = :elerhetoDb WHERE ISBN = :isbn",{isbn:req.body.isbn,cim:req.body.cim,kiado:req.body.kiado,kiadasEve:req.body.kiadasEve,nyelv:req.body.nyelv,ar:req.body.ar,ismerteto:req.body.ismerteto,elerhetoDb:req.body.elerhetoDb});

            if (req.body.formatum.length > 0) {
                await connection2.execute("DELETE FROM E_KONYV WHERE ISBN = :isbn",{isbn:req.body.isbn});
                await connection2.execute("INSERT INTO E_KONYV VALUES (:isbn,:formatum)",{isbn:req.body.isbn,formatum:req.body.formatum});
            }

            if (req.body.hossz > 0) {
                await connection2.execute("DELETE FROM HANGOSKONYV WHERE ISBN = :isbn",{isbn:req.body.isbn});
                await connection2.execute("INSERT INTO HANGOSKONYV VALUES (:isbn,:hossz)",{isbn:req.body.isbn,hossz:req.body.hossz});
            }

            await connection2.execute("DELETE FROM SZERZO WHERE ISBN = :isbn",{isbn:req.body.isbn});
            const szerzokTomb = req.body.szerzok.split(", ");
            for (let szerzo in szerzokTomb) {
                await connection2.execute("INSERT INTO SZERZO VALUES (:isbn,:szerzoneve)",{isbn:req.body.isbn,szerzoneve:szerzokTomb[szerzo]});
            }

            await connection2.execute("DELETE FROM MUFAJ WHERE ISBN = :isbn",{isbn:req.body.isbn});
            const mufajok = req.body.mufajok.split(", ");
            for (let mufaj in mufajok) {
                await connection2.execute("INSERT INTO MUFAJ VALUES (:isbn,:mufajneve)",{isbn:req.body.isbn,mufajneve:mufajok[mufaj]});
            }

            await connection2.commit();
            await connection2.close();

            return res.json({status: "success", message: "Book modified successfully."});

        } catch (err) {
            console.log(err);
        }
    }

    modifyBooks();
})

app.post("/getuserdata",verifyUser,(req,res)=>{
    async function getuserdata() {
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.email});

            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({status: "error", message: "nem talalt felhasznalot"});
            }

            let m_email = result.rows[0][0];
            let m_vezeteknev = result.rows[0][1];
            let m_keresztnev = result.rows[0][2];
            let m_iranyitoszam = result.rows[0][3];
            let m_utca = result.rows[0][4];
            let m_hazszam = result.rows[0][5];
            let m_telefonszam = result.rows[0][6];

            await connection.close();

            return res.json({status: "success", message: "User data sent",email:m_email,vezeteknev:m_vezeteknev,keresztnev:m_keresztnev,iranyitoszam:m_iranyitoszam,utca:m_utca,hazszam:m_hazszam,telefonszam:m_telefonszam});
        } catch (err) {
            console.log(err);
        }
    }

    getuserdata();
})

app.post("/modifyuserdata",(req,res)=>{
    async function modifyuserdata(){
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.body.email});
            await connection.close();
            let torzsv = result.rows[0][7];

            if (req.body.vezeteknev.length < 1 || req.body.vezeteknev.length > 30) {
                return res.json({status: "failed",message: "Vezeteknev is too short or too long."});
            }

            if (req.body.keresztnev.length < 1 || req.body.keresztnev.length > 20) {
                return res.json({status: "failed",message: "Keresztnev is too short or too long."});
            }

            if (req.body.iranyitoszam.toString().length !== 4) {
                return res.json({status: "failed",message: "Iranyitoszam is wrong."});
            }

            if (req.body.utca.length < 1 || req.body.utca.length > 30) {
                return res.json({status: "failed",message: "Utca is too short or too long."});
            }

            if (req.body.hazszam.toString().length < 1) {
                return res.json({status: "failed",message: "Hazszam is empty."});
            }

            if (req.body.telefonszam.toString().length !== 11) {
                return res.json({status: "failed",message: "Telefonszam is wrong."});
            }

            let connection2 = await oracledb.getConnection();

            await connection2.execute("UPDATE VASARLO SET VEZETEKNEV = :vezeteknev, KERESZTNEV = :keresztnev,IRANYITOSZAM = :iranyitoszam,UTCA = :utca,HAZSZAM =: hazszam,TELEFONSZAM =: telefonszam, TORZSVASARLO =: torzsvasarlo WHERE EMAIL = :email",{email:req.body.email,vezeteknev:req.body.vezeteknev,keresztnev:req.body.keresztnev,iranyitoszam:parseInt(req.body.iranyitoszam),utca:req.body.utca,hazszam:parseInt(req.body.hazszam),telefonszam:parseInt(req.body.telefonszam),torzsvasarlo:torzsv});
            await connection2.commit();
            await connection2.close();

            return res.json({status: "success",message:"sikeres módosítás"});

        } catch (err) {
            console.log(err);
        }
    }

    modifyuserdata();
})

app.post("/getbookimages",(req,res)=>{
    async function getbookimages(){
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT ISBN, KEP FROM KIADVANY");

            //osszetett lekerdezes #1 - legolcsobb ekonyv
            const cheapest_e_book = await connection.execute("SELECT KIADVANY.ISBN, CIM, KEP, AR, ELERHETO_DB, E_KONYV.FORMATUM FROM KIADVANY, E_KONYV WHERE KIADVANY.ISBN = E_KONYV.ISBN AND AR IN (SELECT MIN(AR) FROM KIADVANY WHERE ISBN IN (SELECT ISBN FROM E_KONYV))");

            //osszetett lekerdezes #2 - legdragabb hangoskonyv
            const most_expensive = await connection.execute("SELECT KIADVANY.ISBN, CIM, KEP, AR, ELERHETO_DB, HANGOSKONYV.HOSSZ FROM KIADVANY, HANGOSKONYV WHERE KIADVANY.ISBN = HANGOSKONYV.ISBN AND AR IN (SELECT MAX(AR) FROM KIADVANY WHERE ISBN IN (SELECT ISBN FROM HANGOSKONYV))");

            await connection.close();

            return res.json({status: "success",result: result.rows, cheapest_ebook: cheapest_e_book.rows[0], expensive: most_expensive.rows[0]});
        } catch (err) {
            console.log(err);
        }
    }

    getbookimages();
})

app.post("/getbookpage",(req,res)=>{
    async function getbookpage(){
        try {
            bookisbn = req.body.isbn[0];
            return res.json({status: "success",message: bookisbn});
        } catch (err) {
            console.log(err);
        }
    }

    getbookpage();
})

app.post("/showbookpage",(req,res)=>{
    async function showbookpage(){
        try {

            if (bookisbn === "") {
                return res.json({status: "failed",message: "Bad Request"});
            }
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:bookisbn});

            let m_szerzok = "";
            const resultSzerzok = await connection.execute("SELECT * FROM SZERZO WHERE ISBN = :isbn",{isbn:bookisbn});
            for (let i=0; i<resultSzerzok.rows.length-1; i++) {
                m_szerzok += resultSzerzok.rows[i][1];
                m_szerzok += ", ";
            }
            m_szerzok += resultSzerzok.rows[resultSzerzok.rows.length-1][1];

            let m_mufajok = "";
            const resultMufajok = await connection.execute("SELECT * FROM MUFAJ WHERE ISBN = :isbn",{isbn:bookisbn});
            for (let i=0; i<resultMufajok.rows.length-1; i++) {
                m_mufajok += resultMufajok.rows[i][1];
                m_mufajok += ", ";
            }
            m_mufajok += resultMufajok.rows[resultMufajok.rows.length-1][1];

            let m_formatum = "";
            let m_hossz = 0;

            const resultFormatum = await connection.execute("SELECT * FROM E_KONYV WHERE ISBN = :isbn",{isbn:bookisbn});
            if (resultFormatum.rows.length === 1) {
                m_formatum = resultFormatum.rows[0][1];
            }

            const resultHossz = await connection.execute("SELECT * FROM HANGOSKONYV WHERE ISBN = :isbn",{isbn:bookisbn});
            if (resultHossz.rows.length === 1) {
                m_hossz = resultHossz.rows[0][1];
            }

            let eredmeny = result.rows[0];
            eredmeny[10] = m_szerzok;
            eredmeny[11] = m_mufajok;
            eredmeny[12] = m_formatum;
            eredmeny[13] = m_hossz;

            await connection.close();

            return res.json({status: "success", message: "Book found",result: eredmeny});

        } catch (err) {
            console.log(err);
        }
    }

    showbookpage();
})

app.post("/addbooktokosar",verifyUser,(req,res)=>{
    async function addbooktokosar(){
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.email});

            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({Status: "failed", message: "válts vásárlói fiókra, adminként nem lehet vásárolni"});
            }

            let id;
            const kosarcheck = await connection.execute("SELECT * FROM KOSAR WHERE VASARLO = :email AND ALLAPOT = 0",{email:req.email});
            const ids = await connection.execute("SELECT ID FROM KOSAR ORDER BY ID DESC");
            let szamids = ids.rows.map(id => parseInt(id)).sort((a, b) => b - a);
            if (kosarcheck.rows.length === 0) {
                id = szamids[0] + 1;
                id = id.toString();
                await connection.execute("INSERT INTO KOSAR VALUES (:id, :email, :allapot, :mikor)",{id:id,email:req.email,allapot:0,mikor:null});
            } else {
                id = kosarcheck.rows[0][0];
            }

            const bookcheck = await connection.execute("SELECT * FROM KOSAR_TARTALMA WHERE ID = :id AND ISBN = :isbn",{id:id,isbn:req.body.isbn});
            if (bookcheck.rows.length === 0) {
                await connection.execute("INSERT INTO KOSAR_TARTALMA VALUES (:id,:isbn,:darab)",{id:id,isbn:req.body.isbn,darab:req.body.darab});
            } else {
                const darabok = await connection.execute("SELECT DARAB FROM KOSAR_TARTALMA WHERE ID = :id AND ISBN = :isbn",{id:id,isbn:req.body.isbn});
                const ujdarab = parseInt(darabok.rows[0][0])+parseInt(req.body.darab);
                await connection.execute("UPDATE KOSAR_TARTALMA SET DARAB = :darab WHERE ID = :id AND ISBN = :isbn",{id:id,isbn:req.body.isbn,darab:ujdarab});
            }

            const elerhetodb = await connection.execute("SELECT ELERHETO_DB FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.isbn});
            await connection.execute("UPDATE KIADVANY SET ELERHETO_DB = :db WHERE ISBN = :isbn",{db:parseInt(elerhetodb.rows[0][0])-req.body.darab,isbn:req.body.isbn});

            await connection.commit();
            await connection.close();

            return res.json({status: "success", message: "sikeres kosárba tétel"});

        } catch (err) {
            console.log(err);
        }
    }

    addbooktokosar();
})

app.post("/getkosar",verifyUser,(req,res)=>{
    async function getkosar(){
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.email});
            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({Status: "failed", message: "válts vásárlói fiókra, adminként nem lehet vásárolni"});
            }

            const ids = await connection.execute("SELECT ID FROM KOSAR WHERE VASARLO = :email AND ALLAPOT = 0 ORDER BY ID DESC",{email:req.email});
            if (ids.rows.length === 0) {
                await connection.close();
                return res.json({status: "empty"});
            }
            let szamids = ids.rows.map(id => parseInt(id)).sort((a, b) => b - a);


            const rendelesek = await connection.execute("SELECT KIADVANY.ISBN, CIM, KEP, DARAB, AR FROM KIADVANY,KOSAR_TARTALMA WHERE ID = :id AND KIADVANY.ISBN = KOSAR_TARTALMA.ISBN",{id:szamids[0]});
            await connection.close();

            if (rendelesek.rows.length === 0) {
                return res.json({status: "empty"});
            }

            currentkosarid = szamids[0];
            return res.json({status: "success", result: rendelesek.rows});
        } catch (err) {
            console.log(err);
        }
    }

    getkosar();
})

app.post("/deletedarab",(req,res)=>{
    async function deletedarab(){
        try {
            let connection = await oracledb.getConnection();
            const result = await connection.execute("SELECT ELERHETO_DB FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.delIsbn});
            let ujdarab = parseInt(result.rows[0][0]) + parseInt(req.body.delDarab);
            await connection.execute("UPDATE KIADVANY SET ELERHETO_DB = :db WHERE ISBN = :isbn",{db:ujdarab,isbn:req.body.delIsbn});

            const kosardb = await connection.execute("SELECT DARAB FROM KOSAR_TARTALMA WHERE ISBN = :isbn AND ID = :id",{isbn:req.body.delIsbn,id:currentkosarid});
            let ujkosardarab = parseInt(kosardb.rows[0][0]) - parseInt(req.body.delDarab);

            await connection.execute("UPDATE KOSAR_TARTALMA SET DARAB = :darab WHERE ISBN =: isbn AND ID = :id",{darab: ujkosardarab, isbn:req.body.delIsbn, id:currentkosarid});

            //nem engedi, hogy egy könyvből egy kosárban 0 db legyen - Stored Procedure (REMOVEFROMKOSAR)
            await connection.execute("BEGIN REMOVEFROMKOSAR(); END;");

            await connection.commit();
            await connection.close();

            return res.json({status: "success"});
        } catch (err) {
            console.log(err);
        }
    }

    deletedarab();
})

app.post("/order",(req,res)=>{
    async function order(){
        try {
            let connection = await oracledb.getConnection();

            await connection.execute("UPDATE KOSAR SET ALLAPOT = 1, MIKOR = CURRENT_TIMESTAMP WHERE ID = :id",{id:currentkosarid});

            await connection.commit();
            await connection.close();

            return res.json({status: "success"});
        } catch (err) {
            console.log(err);
        }
    }

    order();
})

app.post("/getrendeles",verifyUser,(req,res)=>{
    async function getrendeles(){
        try {

            if (currentkosarid === 0) {
                return res.json({Status: "failed", message: "először rendelned kell"});
            }

            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.email});
            if (result.rows.length !== 1) {
                await connection.close();
                return res.json({Status: "failed", message: "válts vásárlói fiókra, adminként nem lehet vásárolni"});
            }

            const orderItems = await connection.execute("SELECT CIM, AR, DARAB, KIADVANY.ISBN FROM KIADVANY, KOSAR_TARTALMA WHERE KOSAR_TARTALMA.ID = :id AND KOSAR_TARTALMA.ISBN = KIADVANY.ISBN",{id:currentkosarid});

            await connection.close();

            return res.json({status: "success", orderItems: orderItems.rows, rendelesid: currentkosarid});
        } catch (err) {
            console.log(err);
        }
    }

    getrendeles();
})

app.post("/getallbooks",(req,res)=>{
    async function getallbooks(){
        try {
            let connection = await oracledb.getConnection();

            const result = await connection.execute("SELECT ISBN, CIM, NYELV, AR, ELERHETO_DB, KEP FROM KIADVANY");

            for (const row of result.rows) {
                let m_szerzok = "";
                const resultSzerzok = await connection.execute("SELECT * FROM SZERZO WHERE ISBN = :isbn",{isbn:row[0]});
                for (let i=0; i<resultSzerzok.rows.length-1; i++) {
                    m_szerzok += resultSzerzok.rows[i][1];
                    m_szerzok += ", ";
                }
                m_szerzok += resultSzerzok.rows[resultSzerzok.rows.length-1][1];

                let m_mufajok = "";
                const resultMufajok = await connection.execute("SELECT * FROM MUFAJ WHERE ISBN = :isbn",{isbn:row[0]});
                for (let i=0; i<resultMufajok.rows.length-1; i++) {
                    m_mufajok += resultMufajok.rows[i][1];
                    m_mufajok += ", ";
                }
                m_mufajok += resultMufajok.rows[resultMufajok.rows.length-1][1];

                let m_formatum = "";
                let m_hossz = 0;

                const resultFormatum = await connection.execute("SELECT * FROM E_KONYV WHERE ISBN = :isbn",{isbn:row[0]});
                if (resultFormatum.rows.length === 1) {
                    m_formatum = resultFormatum.rows[0][1];
                }

                const resultHossz = await connection.execute("SELECT * FROM HANGOSKONYV WHERE ISBN = :isbn",{isbn:row[0]});
                if (resultHossz.rows.length === 1) {
                    m_hossz = resultHossz.rows[0][1];
                }

                row[6] = m_szerzok;
                row[7] = m_mufajok;
                row[8] = m_formatum;
                row[9] = m_hossz;
            }

            await connection.close();

            return res.json({status: "success", result: result.rows});

        } catch (err) {
            console.log(err);
        }
    }

    getallbooks();
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    userEmail = "";
    bookisbn = "";
    currentkosarid = 0;
    return res.json({Status:"Success"});
})

app.listen(8081, () =>{
    console.log("Connected to the server");
});