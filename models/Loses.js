const connection = require("../database/db");

module.exports = class Loses {
    /**
     *!Source - Mevcut Olmayan Departmanlara Yönlendirilen Hastaların Bilgileri
     */
    static getall_other_sicks() {
        return connection.execute(`
            SELECT 
                examination.id as examination_id,

                sick.id as sick_id,
                sick.name as sick_name,
                sick.surname as sick_surname,
                gender.id as gender_id,
                gender.name as gender_name,
                sick.birthday as sick_birthday,
                
                doctor.id as doctor_id,
                doctor.name as doctor_name,
                doctor.surname as doctor_surname,
                
                examination.record_date as examination_record_date,
                
                department.id as department_id,
                department.name as department_name,
                department.examination_price as department_examination_price
            FROM examination
                INNER JOIN sick ON examination.sick_id = sick.id
                INNER JOIN gender ON sick.gender_id = gender.id
                INNER JOIN doctor ON examination.doctor_id = doctor.id
                INNER JOIN department ON examination.directed_department_id = department.id
            WHERE examination.directed_department_id IS NOT NULL
        `);
    }

    // Mevcut Olmayan Departmanlara Yönlendirilen Hastaların Sayısı
    static numbers_of_examinations_for_unavailable_departments() {
        return connection.execute(`
            SELECT 
                department.id as department_id,
                department.name as department_name,
                COUNT(examination.id) as number
            FROM examination
                INNER JOIN department ON examination.directed_department_id = department.id
            WHERE examination.directed_department_id IS NOT NULL
            GROUP BY department.id
            ORDER BY number DESC
        `);
    }

    // Mevcut Olmayan Departmanlara Yönlendirilen Hastalardan Dolayı Elde Edilemeyen Gelir
    static revenues_of_examinations_for_unavailable_departments() {
        return connection.execute(`
            SELECT 
                department.id as department_id,
                department.name as department_name,
                (department.examination_price * COUNT(examination.id)) as total_cost
            FROM examination
                INNER JOIN department ON examination.directed_department_id = department.id
            WHERE examination.directed_department_id IS NOT NULL
            GROUP BY department.id
            ORDER BY total_cost DESC
        `);
    }

    // Aylara Göre Mevcut Olmayan Departmanlara Yönlendirilen Toplam Hasta Sayıları
    static numbers_of_examinations_for_unavailable_departments_by_month() {
        return connection.execute(`
            SELECT 
                MONTH(examination.record_date) as month,
                COUNT(examination.id) as number
            FROM examination
            WHERE examination.directed_department_id IS NOT NULL
            GROUP BY MONTH(examination.record_date)
        `);
    }

    // Aylara Göre Mevcut Olmayan Departmanlara Yönlendirilen Departman Bazında Hasta Sayıları
    static numbers_of_examinations_for_unavailable_departments_by_month_by_department() {
        return connection.execute(`
            SELECT 
                department.id as department_id,
                department.name as department_name,
                MONTH(examination.record_date) as month,
                COUNT(examination.id) as number
                            
            FROM examination
                INNER JOIN department ON examination.directed_department_id = department.id
            WHERE examination.directed_department_id IS NOT NULL
            GROUP BY MONTH(examination.record_date), department.id
            ORDER BY department.name ASC, month ASC
        `);
    }
};
