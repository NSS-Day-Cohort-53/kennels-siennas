import React, { useState, useEffect } from "react";
import Employee from "./Employee";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import "./EmployeeList.css";

export default () => {
    const [emps, setEmployees] = useState([]);

    useEffect(() => {
        EmployeeRepository.getAll().then((employeeArray) => setEmployees(employeeArray));
    }, []);

    return (
        <>
            <div className="employees">
                {emps.map((a) => (
                    <Employee setEmps={setEmployees} key={a.id} employee={a} />
                ))}
            </div>
        </>
    );
};
