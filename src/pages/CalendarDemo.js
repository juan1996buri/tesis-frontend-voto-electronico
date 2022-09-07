import React, { Component } from "react";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";

export class CalendarDemo extends Component {
    constructor(props) {
        super(props);

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;
    }

    dateTemplate(date) {
        if (date.day > 10 && date.day < 15) {
            return <strong style={{ textDecoration: "line-through" }}>{date.day}</strong>;
        }

        return date.day;
    }

    render() {
        return (
            <div>
                <div className="card">
                    <h5>Popup</h5>

                    <h5>Inline</h5>
                    <Calendar value={this.state.date14} onChange={(e) => this.setState({ date14: e.value })} inline showWeek />
                </div>
            </div>
        );
    }
}
