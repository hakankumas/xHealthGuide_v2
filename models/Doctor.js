const connection = require("../database/db");

module.exports = class Doctor {
    /**
     *!Source - Doktor Bilgileri
     */
    static getall() {
        return connection.execute(`
            SELECT 
                doctor.id as doctor_id,
                doctor.name as doctor_name,
                doctor.surname as doctor_surname,
                gender.id as gender_id,
                gender.name as gender_name,
                department.id as department_id,
                department.name as department_name
            FROM doctor
                INNER JOIN gender ON doctor.gender_id = gender.id
                INNER JOIN department ON doctor.department_id = department.id
                ORDER BY department.id    
        `);
    }

    // Departmanlardaki Doktor Sayıları
    static number_of_doctors_in_departments() {
        return connection.execute(`
            SELECT
                department.id as department_id,
                department.name as department_name,
                COUNT(doctor.id) as number
            FROM doctor
            INNER JOIN department ON doctor.department_id = department.id
            GROUP BY department.id
            ORDER BY number DESC
        `);
    }

    // TODO| Doktorların Cinsiyetlerine Göre Dağılımı
    static distribution_of_doctors_by_gender() {
        return connection.execute(`
            SELECT
                gender.id as  gender_id,
                gender.name as gender_name,
                COUNT(doctor.id) as number
            FROM doctor
            INNER JOIN gender ON doctor.gender_id = gender.id
            GROUP BY gender.id
            ORDER BY number DESC
        `);
    }

    // Doktorların Departmanlarına Göre Cinsiyet Dağılımı
    static distribution_of_doctors_by_gender_in_departments() {
        return connection.execute(`
            SELECT 
                department.id AS department_id,
                department.name AS department_name,
                gender.id AS gender_id,
                gender.name AS gender_name,
                COUNT(doctor.id) AS number
            FROM (SELECT DISTINCT department_id FROM doctor) AS active_departments
            JOIN department ON department.id = active_departments.department_id
            CROSS JOIN gender 
            LEFT JOIN doctor ON doctor.department_id = department.id AND doctor.gender_id = gender.id
            GROUP BY department.id, gender.id
            ORDER BY department.id, gender.id
        `);
    }

    // TODO| Dahiliye Doktorlarının Muayene Dağılımı
    static distribution_of_examination_by_internists() {
        return connection.execute(`
            SELECT
                doctor.id as doctor_id,
                CONCAT(doctor.name,' ',doctor.surname) as doctor_fullname,
                COUNT(examination.id) as number
            FROM examination
            INNER JOIN sick ON examination.sick_id = sick.id
            INNER JOIN doctor ON examination.doctor_id = doctor.id
            GROUP BY doctor.id
            ORDER BY number DESC
        `);
    }

    // TODO| Aylara Göre Dahiliye Departmanındaki Toplam Muayene Sayıları
    static monthly_examination_numbers_of_all_internists() {
        return connection.execute(`
            SELECT
                MONTH(examination.record_date) as month,
                COUNT(examination.id) as number
            FROM examination
            INNER JOIN sick ON examination.sick_id = sick.id
            INNER JOIN doctor ON examination.doctor_id = doctor.id
            GROUP BY MONTH(examination.record_date)
        `);
    }

    // TODO| Aylara Göre Dahiliye Departmanındaki Doktorların Bireysel Muayene Sayıları
    static number_of_examination_for_internists_by_month() {
        return connection.execute(`
            SELECT
                doctor.id as doctor_id,
                CONCAT(doctor.name,' ',doctor.surname) as doctor_fullname,
                            
                MONTH(examination.record_date) as month,
                COUNT(examination.id) as number
                
            FROM examination
                INNER JOIN doctor ON examination.doctor_id = doctor.id
                INNER JOIN department ON doctor.department_id = department.id
            GROUP BY doctor.id, MONTH(examination.record_date)
            ORDER BY doctor.name ASC, MONTH(examination.record_date) ASC
        `);
    }

    // Dahiliye Harici Doktorlarının Muayene Dağılımı
    // static distribution_of_examination_for_other_doctors() {
    //     return connection.execute(`
    //         SELECT
    //             department.id AS department_department_id,
    //             department.name AS department_department_name,
    //             doctor.id AS doctor_id,
    //             CONCAT(doctor.name,' ',doctor.surname) as doctor_fullname,
    //             (COUNT(CASE WHEN examination.directed_doctor1 = doctor.id THEN 1 END) +
    //             COUNT(CASE WHEN examination.directed_doctor2 = doctor.id THEN 1 END)) AS total_examinations
    //         FROM doctor
    //         LEFT JOIN department ON doctor.department_id = department.id
    //         LEFT JOIN examination ON doctor.id IN (examination.directed_doctor1, examination.directed_doctor2)
    //         WHERE department.id != 1
    //         GROUP BY doctor.id
    //         ORDER BY department.name, doctor.name
    //     `);
    // }

    // TODO| Dahiliye Haricindeki Departmanların Muayene ve Hasılat Sayıları
    static distribution_of_examination_and_revenue_for_other_departments() {
        return connection.execute(`
            SELECT 
                department_department_id,
                department_department_name,
                department_examination_price,
                SUM(total_examinations) as number_examination,
                (department_examination_price * SUM(total_examinations)) as total_revenue
            FROM (
                SELECT 
                    department.id AS department_department_id,
                    department.name AS department_department_name,
                    department.examination_price as department_examination_price,
                    doctor.id AS doctor_id,
                    CONCAT(doctor.name,' ',doctor.surname) as doctor_fullname,
                    (COUNT(CASE WHEN examination.directed_doctor1 = doctor.id THEN 1 END) + 
                    COUNT(CASE WHEN examination.directed_doctor2 = doctor.id THEN 1 END)) AS total_examinations
                FROM doctor
                LEFT JOIN department ON doctor.department_id = department.id
                LEFT JOIN examination ON doctor.id IN (examination.directed_doctor1, examination.directed_doctor2)
                WHERE department.id != 1
                GROUP BY doctor.id
            ) as subquery
            GROUP BY department_department_id
            ORDER BY number_examination DESC
        `);
    }

    // Tüm Departmanların Muayene ve Hasılat Sayıları
    static distribution_of_examination_and_revenue_for_all_departments() {
        return connection.execute(`
            SELECT 
                department_department_id,
                department_department_name,
                department_examination_price,
                SUM(total_examinations) as number_examination,
				(department_examination_price * SUM(total_examinations)) as total_revenue
            FROM (
                SELECT 
                    department.id AS department_department_id,
                    department.name AS department_department_name,
                    department.examination_price AS department_examination_price,
                    doctor.id AS doctor_id,
                    CONCAT(doctor.name,' ',doctor.surname) as doctor_fullname,
                    (COUNT(CASE WHEN examination.doctor_id = doctor.id THEN 1 END) + 
                    COUNT(CASE WHEN examination.directed_doctor1 = doctor.id THEN 1 END) + 
                    COUNT(CASE WHEN examination.directed_doctor2 = doctor.id THEN 1 END)) AS total_examinations
                FROM doctor
                LEFT JOIN department ON doctor.department_id = department.id
                LEFT JOIN examination ON doctor.id IN (examination.doctor_id, examination.directed_doctor1, examination.directed_doctor2)
                GROUP BY doctor.id
            ) as subquery
            GROUP BY department_department_id
            ORDER BY total_revenue DESC
        `);
    }
};
