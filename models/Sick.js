const connection = require("../database/db");

module.exports = class Sick {
    /**
     *!Source - Hasta Bilgileri
     */
    static getall_sicks() {
        return connection.execute(`
            SELECT
                sick.id as sick_id,
                sick.name as sick_name,
                sick.surname as sick_surname,
                gender.id as  gender_id,
                gender.name as gender_name,
                sick.birthday as sick_birthday
            FROM sick
            INNER JOIN gender ON sick.gender_id = gender.id
        `);
    }

    // Hastaların Doğum Tarihlerine Göre Dağılımı
    static sick_by_birthday() {
        return connection.execute(`
            SELECT
                YEAR(sick.birthday) as sick_yearofbirth,
                COUNT(sick.id) as number
            FROM sick
            GROUP BY YEAR(sick.birthday)
            ORDER BY sick_yearofbirth
        `);
    }

    // TODO| Hastaların Cinsiyetlerine Göre Dağılımı
    static sick_by_gender() {
        return connection.execute(`
            SELECT
                gender.id as  gender_id,
                gender.name as gender_name,
                COUNT(sick.id) as number
            FROM sick
            INNER JOIN gender ON sick.gender_id = gender.id
            GROUP BY gender.id
            ORDER BY number DESC
        `);
    }

    /**
     *!Source - Hastaların İlk Muayene Bilgileri
     */
    static examination_getall_first() {
        return connection.execute(`
            SELECT
                examination.id as examination_id,
                
                sick.id as sick_id,
                sick.name as sick_name,
                sick.surname as sick_surname,
                
                doctor.id as doctor_id,
                doctor.name as doctor_name,
                doctor.surname as doctor_surname,

                examination.record_date as examination_record_date
            FROM examination
            INNER JOIN sick ON examination.sick_id = sick.id
            INNER JOIN doctor ON examination.doctor_id = doctor.id
        `);
    }

    /**
     *!Source - Hastaların Detaylı Muayene Bilgileri
     */
    static examination_getall_detailed() {
        return connection.execute(`
            SELECT
                examination.id as examination_id,
                
                sick.id as sick_id,
                sick.name as sick_name,
                sick.surname as sick_surname,
                gender.id as gender_id,
                gender.name as gender_name,
                sick.birthday,
                
                doctor1.id as doctor_id1,
                doctor1.name as doctor_name1,
                doctor1.surname as doctor_surname1,
                department1.id as department_id1,
                department1.name as department_name1,

                examination.record_date as examination_record_date,

                doctor2.id as doctor_id2,
                doctor2.name as doctor_name2,
                doctor2.surname as doctor_surname2,
                department2.id as department_id2,
                department2.name as department_name2,
                
                doctor3.id as doctor_id3,
                doctor3.name as doctor_name3,
                doctor3.surname as doctor_surname3,
                department3.id as department_id3,
                department3.name as department_name3

            FROM examination
            INNER JOIN sick ON examination.sick_id = sick.id
            INNER JOIN gender ON sick.gender_id = gender.id

            INNER JOIN doctor as doctor1 ON examination.doctor_id = doctor1.id
            INNER JOIN department as department1 ON doctor1.department_id = department1.id

            LEFT JOIN doctor as doctor2 ON examination.directed_doctor1 = doctor2.id
            LEFT JOIN department as department2 ON doctor2.department_id = department2.id

            LEFT JOIN doctor as doctor3 ON examination.directed_doctor2 = doctor3.id 
            LEFT JOIN department as department3 ON doctor3.department_id = department3.id
        `);
    }

    /**
     *!Source - Hastaların Toplam Tedavi Masrafları
     */
    static total_examination_costs_for_sicks() {
        return connection.execute(`
            SELECT
                examination.id as examination_id,
                examination.record_date as examination_record_date,
                
                sick.id as sick_id,
                
                department1.id as department_id1,
                department2.id as department_id2,
                department3.id as department_id3,
                
                department1.examination_price as department_examination_price1,
                department2.examination_price as department_examination_price2,
                department3.examination_price as department_examination_price3,
                
                 ROUND(
                 	COALESCE(department1.examination_price, 0) + 
                    COALESCE(department2.examination_price, 0) + 
                    COALESCE(department3.examination_price, 0)
                 ) as total_price

            FROM examination
            INNER JOIN sick ON examination.sick_id = sick.id

            INNER JOIN doctor as doctor1 ON examination.doctor_id = doctor1.id
            INNER JOIN department as department1 ON doctor1.department_id = department1.id

            LEFT JOIN doctor as doctor2 ON examination.directed_doctor1 = doctor2.id
            LEFT JOIN department as department2 ON doctor2.department_id = department2.id

            LEFT JOIN doctor as doctor3 ON examination.directed_doctor2 = doctor3.id 
            LEFT JOIN department as department3 ON doctor3.department_id = department3.id;
        `);
    }

    // TODO| Tedaviye Başlanma Tarihine Göre Elde Edilen Gelirler
    static total_revenue_by_record_date() {
        return connection.execute(`
            SELECT
                MONTH(examination.record_date) AS month,
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
            GROUP BY MONTH(examination.record_date)
        `);
    }
};
