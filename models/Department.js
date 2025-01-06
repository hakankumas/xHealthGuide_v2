const connection = require("../database/db");

module.exports = class Department {
    // Departmanlar Listesi
    static list_departments() {
        return connection.execute(`
            SELECT 
                department.id as department_id,
                department.name as department_name,
                department.examination_price as department_examination_price
            FROM department
            WHERE department.id > 8
            ORDER BY department.name
        `);
    }

    // Muayene Ücreti Güncelleme
    static update_examination_price(condition) {
        const { department_id, examination_price } = condition;
        return connection.execute(`
            UPDATE department SET examination_price = ${examination_price} WHERE id = ${department_id}            
        `);
    }
};
