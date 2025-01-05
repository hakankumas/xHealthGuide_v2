const connection = require("../database/db");

module.exports = class Count {
    // Toplam Hasılat
    static total_revenue() {
        return connection.execute(`
            SELECT
                 SUM(ROUND(
                 	COALESCE(department1.examination_price, 0) + 
                    COALESCE(department2.examination_price, 0) + 
                    COALESCE(department3.examination_price, 0)
                 )) as number

            FROM examination

            INNER JOIN doctor as doctor1 ON examination.doctor_id = doctor1.id
            INNER JOIN department as department1 ON doctor1.department_id = department1.id

            LEFT JOIN doctor as doctor2 ON examination.directed_doctor1 = doctor2.id
            LEFT JOIN department as department2 ON doctor2.department_id = department2.id

            LEFT JOIN doctor as doctor3 ON examination.directed_doctor2 = doctor3.id 
            LEFT JOIN department as department3 ON doctor3.department_id = department3.id
        `);
    }

    // Toplam Muayene
    static total_examination() {
        return connection.execute(`
            SELECT 
                COUNT(examination.doctor_id) AS number1,
                COUNT(examination.directed_doctor1) AS number2,
                COUNT(examination.directed_doctor2) AS number3,
                (COUNT(examination.doctor_id) + 
                COUNT(examination.directed_doctor1) + 
                COUNT(examination.directed_doctor2)) AS number
            FROM examination
        `);
    }

    // Aktif Departman
    static total_department() {
        return connection.execute(`
            SELECT COUNT(DISTINCT department_id) as number
            FROM doctor;
        `);
    }

    // Açılabilir Departman
    static need_total_department() {
        return connection.execute(`
            SELECT COUNT(*) as number
            FROM department
            WHERE department.id NOT IN(
                SELECT DISTINCT department_id
                FROM doctor
            )
        `);
    }

    // Toplam Doktor
    static total_doctor() {
        return connection.execute(`
            SELECT COUNT(doctor.id) as number
            FROM doctor
        `);
    }
};
