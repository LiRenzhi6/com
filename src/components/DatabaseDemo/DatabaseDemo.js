
import React, { Component } from 'react';
import './DatabaseDemo.css';
class DatabaseDemo extends Component {
    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleButtonClickDel = this.handleButtonClickDel.bind(this);
        this.handleButtonClickUpdate = this.handleButtonClickUpdate.bind(this);
        this.handleButtonClickSelect = this.handleButtonClickSelect.bind(this);
        this.handleButtonClickAdd = this.handleButtonClickAdd.bind(this);
        // this.BASE_URL = '';
        this.BASE_URL = 'http://localhost:4000';
        this.state = {
            employees: [],
            id: "",
            name: "",
            departID: "",
            depart: "",
            mail: ""
        }
    }

    componentDidMount() {
        this.populateData();
    }

    populateData() {
        console.log("---state set");
        //this.fetch_retry('/api/employee', 3)
        this.fetch_retry('/employee', 3)
            .then(res => res.json())
            .then((data) => {
                this.setState({ employees: data.result });
                console.log("state set");
                console.log(this.state.employees);
            })
            .catch(console.log);

    }

    async fetch_retry(url, n) {
        try {
            return await fetch(this.BASE_URL + url)
        } catch (err) {
            if (n === 1) throw err;
            await new Promise(resolve => setTimeout(resolve, 1000));
            return await this.fetch_retry(url, n - 1);
        }
    };


    renderTableData() {
        return this.state.employees.map((employee, index) => {
            const { id, name, departID, depart, mail } = employee //destructuring
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{departID}</td>
                    <td>{depart}</td>
                    <td>{mail}</td>
                    <td><input type="button" value="SELECT" onClick={() => this.handleButtonClickSelect({ id }, { name }, { departID }, { depart }, { mail })} />
                        &nbsp;<input type="button" value="DELETE" onClick={() => this.handleButtonClickDel({ id })} /></td>
                </tr>
            )
        })
    }

    handleButtonClickDel(id) {
        console.log(JSON.parse(JSON.stringify(id)).id);
        let tmpId = JSON.parse(JSON.stringify(id)).id;
        const requestOptions = {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "kind": 3, "id": tmpId })
        }

        // fetch(this.BASE_URL + '/api/employee/id', requestOptions)
        fetch(this.BASE_URL + '/employee/id', requestOptions)
            .then(response => response.json())
            .then(data => this.populateData())

        this.setState({ name: "", departID: "", depart: "", mail: "" });

    }

    handleButtonClickAdd() {
        console.log(this.state.name);
        console.log(this.state.depart);
        console.log(this.state.mail);
        const requestOptions = {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "kind": "1", "name": this.state.name, "departID": this.state.departID, "mail": this.state.mail })
        }

        fetch(this.BASE_URL + '/employee', requestOptions)//TODO
            // fetch(this.BASE_URL + '/api/employee', requestOptions)//TODO
            .then(response => response.json())
            .then(data => this.populateData())
            .catch(e => console.log(e))

        this.setState({ name: "", departID: "", depart: "", mail: "" });

    }

    handleButtonClickSelect(id, name, departID, depart, mail) {

        this.setState({ id: JSON.parse(JSON.stringify(id)).id, name: JSON.parse(JSON.stringify(name)).name, departID: JSON.parse(JSON.stringify(departID)).departID, depart: JSON.parse(JSON.stringify(depart)).depart, mail: JSON.parse(JSON.stringify(mail)).mail });

    }

    handleButtonClickUpdate() {
        console.log(this.state.name);
        console.log(this.state.depart);
        console.log(this.state.mail);
        console.log(this.state.id);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "kind": "2", "id": this.state.id, "name": this.state.name, "departID": this.state.departID, "mail": this.state.mail })
        }

        //fetch('/api/employee', requestOptions)
        fetch(this.BASE_URL + '/employee', requestOptions)
            .then(response => response.json())
            .then(data => this.populateData())

        this.setState({ name: "", departID: "", depart: "", mail: "" });

    }

    handleTextChange(e) {
        console.log(e.target.name)
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {
        return (
            <div>
                <h1 id='title' style={{ paddingRight: "1em" }}>AWS Three Tier Web Demo Page</h1>
                <table id='employees'>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>员工名字www</th>
                            <th>部门ID</th>
                            <th>部门名称</th>
                            <th>邮件地址</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="text" name="name" value={this.state.name} onChange={this.handleTextChange} /></td>
                            <td><input type="text" name="departID" value={this.state.departID} onChange={this.handleTextChange} /></td>
                            <td><input type="text" name="depart" readOnly value={this.state.depart} onChange={this.handleTextChange} /></td>
                            <td><input type="text" name="mail" value={this.state.mail} onChange={this.handleTextChange} /></td>
                            <td><input type="button" value="ADD" onClick={this.handleButtonClickAdd} /> &nbsp;
                                <input type="button" value="UPDATE" onClick={this.handleButtonClickUpdate} /></td>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>

        );
    }
}

export default DatabaseDemo;