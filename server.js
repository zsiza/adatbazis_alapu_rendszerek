import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const salt = 10;
let userEmail = "";

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

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({Error: "You are not authenticated"});
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
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            const result = await connection.execute("SELECT * FROM ADMIN WHERE EMAIL = :email",{email:req.email});
            await connection.close();

            if (result.rows.length === 1) {
                return res.json({Status: "Success", email: req.email, admin: true});
            } else {
                return res.json({Status: "Success", email: req.email, admin: false});
            }

        } catch (err) {
            return err;
        }
    }

    adminCheck();
})

app.post("/signup", (req, res) => {
    async function signup(){
        try {
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

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

            await connection.execute("INSERT INTO FELHASZNALO VALUES (:email,:jelszo)",{email:req.body.email,jelszo:hashedJelszo});
            await connection.execute("INSERT INTO VASARLO VALUES (:email,:vezeteknev,:keresztnev,:iranyitoszam,:utca,:hazszam,:telefonszam,0)",{email:req.body.email,vezeteknev:req.body.vezeteknev,keresztnev:req.body.keresztnev,iranyitoszam:parseInt(req.body.iranyitoszam),utca:req.body.utca,hazszam:parseInt(req.body.hazszam),telefonszam:parseInt(req.body.telefonszam)});
            await connection.commit();
            await connection.close();

            res.clearCookie("token");

            return res.json({status: "success",message:"successful signup"});

        } catch (err) {
            return err;
        }
    }

    signup();
})

app.post("/login", (req, res) => {
    async function login(){
        try {
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

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

            const result = await connection.execute("SELECT * FROM FELHASZNALO WHERE EMAIL = :email",{email:req.body.email});
            await connection.close();

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
            return err;
        }
    }

    login();
})

app.post("/addBooks", (req, res) => {
    async function addBooks(){
        try {
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            if (req.body.isbn.length !== 13) {
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const check = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.isbn});
            if (check.rows.length === 1) {
                return res.json({status: "failed",message:"Book is already in the database."});
            }

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

            await connection.execute("INSERT INTO KIADVANY VALUES (:isbn,:cim,:kiado,:kiadasEve,:nyelv,:ar,:ismerteto,:elerhetoDb,:adminEmail)",{isbn:req.body.isbn,cim:req.body.cim,kiado:req.body.kiado,kiadasEve:req.body.kiadasEve,nyelv:req.body.nyelv,ar:req.body.ar,ismerteto:req.body.ismerteto,elerhetoDb:req.body.elerhetoDb,adminEmail:userEmail});

            if (req.body.formatum.length > 0) {
                await connection.execute("INSERT INTO E_KONYV VALUES (:isbn,:formatum)",{isbn:req.body.isbn,formatum:req.body.formatum});
            }

            if (req.body.hossz > 0) {
                await connection.execute("INSERT INTO HANGOSKONYV VALUES (:isbn,:hossz)",{isbn:req.body.isbn,hossz:req.body.hossz});
            }

            const szerzok = req.body.szerzok.split(", ");
            for (let szerzo in szerzok) {
                await connection.execute("INSERT INTO SZERZO VALUES (:isbn,:szerzoneve)",{isbn:req.body.isbn,szerzoneve:szerzok[szerzo]});
            }

            const mufajok = req.body.mufajok.split(", ");
            for (let mufaj in mufajok) {
                await connection.execute("INSERT INTO MUFAJ VALUES (:isbn,:mufajneve)",{isbn:req.body.isbn,mufajneve:mufajok[mufaj]});
            }

            await connection.commit();
            await connection.close();

            return res.json({status: "success", message:"Successfully added"});
        } catch (err) {
            return err;
        }
    }

    addBooks();
})

app.post("/deleteBooks", (req, res) => {
    async function deleteBook() {
        try {
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            if (req.body.delisbn.length !== 13) {
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const result = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.delisbn});
            if (result.rows.length !== 1) {
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
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            if (req.body.searchisbn.length !== 13) {
                return res.json({status: "failed",message: "ISBN is empty or too long."});
            }

            const result = await connection.execute("SELECT * FROM KIADVANY WHERE ISBN = :isbn",{isbn:req.body.searchisbn});
            if (result.rows.length !== 1) {
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
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

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

            await connection.execute("UPDATE KIADVANY SET CIM = :cim,KIADO = :kiado,KIADAS_EVE = :kiadasEve,NYELV = :nyelv,AR = :ar,ISMERTETO = :ismerteto, ELERHETO_DB = :elerhetoDb WHERE ISBN = :isbn",{isbn:req.body.isbn,cim:req.body.cim,kiado:req.body.kiado,kiadasEve:req.body.kiadasEve,nyelv:req.body.nyelv,ar:req.body.ar,ismerteto:req.body.ismerteto,elerhetoDb:req.body.elerhetoDb});

            if (req.body.formatum.length > 0) {
                await connection.execute("DELETE FROM E_KONYV WHERE ISBN = :isbn",{isbn:req.body.isbn});
                await connection.execute("INSERT INTO E_KONYV VALUES (:isbn,:formatum)",{isbn:req.body.isbn,formatum:req.body.formatum});
            }

            if (req.body.hossz > 0) {
                await connection.execute("DELETE FROM HANGOSKONYV WHERE ISBN = :isbn",{isbn:req.body.isbn});
                await connection.execute("INSERT INTO HANGOSKONYV VALUES (:isbn,:hossz)",{isbn:req.body.isbn,hossz:req.body.hossz});
            }

            await connection.execute("DELETE FROM SZERZO WHERE ISBN = :isbn",{isbn:req.body.isbn});
            const szerzokTomb = req.body.szerzok.split(", ");
            for (let szerzo in szerzokTomb) {
                await connection.execute("INSERT INTO SZERZO VALUES (:isbn,:szerzoneve)",{isbn:req.body.isbn,szerzoneve:szerzokTomb[szerzo]});
            }

            await connection.execute("DELETE FROM MUFAJ WHERE ISBN = :isbn",{isbn:req.body.isbn});
            const mufajok = req.body.mufajok.split(", ");
            for (let mufaj in mufajok) {
                await connection.execute("INSERT INTO MUFAJ VALUES (:isbn,:mufajneve)",{isbn:req.body.isbn,mufajneve:mufajok[mufaj]});
            }

            await connection.commit();
            await connection.close();

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
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.email});

            if (result.rows.length !== 1) {
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
            let connection = await oracledb.getConnection({
                user : "C##HBV23R",
                password : "alma123",
                connectString : "localhost:1521/FREE"
            });

            const result = await connection.execute("SELECT * FROM VASARLO WHERE EMAIL = :email",{email:req.body.email});
            let torzsv = result.rows[0][7];
            console.log(torzsv);

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

            await connection.execute("DELETE FROM VASARLO WHERE EMAIL = :email",{email:req.body.email});
            await connection.execute("INSERT INTO VASARLO VALUES (:email,:vezeteknev,:keresztnev,:iranyitoszam,:utca,:hazszam,:telefonszam,:torzsvasarlo)",{email:req.body.email,vezeteknev:req.body.vezeteknev,keresztnev:req.body.keresztnev,iranyitoszam:parseInt(req.body.iranyitoszam),utca:req.body.utca,hazszam:parseInt(req.body.hazszam),telefonszam:parseInt(req.body.telefonszam),torzsvasarlo:torzsv});
            await connection.commit();
            await connection.close();

            return res.json({status: "success",message:"sikeres módosítás"});

        } catch (err) {
            return err;
        }
    }

    modifyuserdata();
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({Status:"Success"});
})

app.listen(8081, () =>{
    console.log("Connected to the server");
});