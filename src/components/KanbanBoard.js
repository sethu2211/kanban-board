import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../services/api'; 
import TodoIcon from '../assets/icons/To-do.svg';
import InProgressIcon from '../assets/icons/in-progress.svg';
import DoneIcon from '../assets/icons/Done.svg';
import BacklogIcon from '../assets/icons/Backlog.svg';
import LowPriorityIcon from '../assets/icons/Img - Low Priority.svg';
import MediumPriorityIcon from '../assets/icons/Img - Medium Priority.svg';
import HighPriorityIcon from '../assets/icons/Img - High Priority.svg';
import UrgentPriorityIcon from '../assets/icons/SVG - Urgent Priority colour.svg';
import '../styles/KanbanBoard.css';

const statusLabels = {
    "Todo": "To Do",
    "In Progress": "In Progress",
    "Done": "Done",
    "Backlog": "Backlog"
};

const priorityLabels = {
    0: "No Priority",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent"
};

const statusIcons = {
    "Todo": TodoIcon,
    "In Progress": InProgressIcon,
    "Done": DoneIcon,
    "Backlog": BacklogIcon
};

const priorityIcons = {
    1: LowPriorityIcon,
    2: MediumPriorityIcon,
    3: HighPriorityIcon,
    4: UrgentPriorityIcon
};

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status');
    const [sorting, setSorting] = useState('priority');

    useEffect(() => {
        const getTickets = async () => {
            const data = await fetchTickets();
            setTickets(data);
        };
        getTickets();
    }, []);

    const groupTickets = () => {
        const grouped = {};
        tickets.forEach(ticket => {
            let key;
            switch (grouping) {
                case 'status':
                    key = ticket.status;
                    break;
                case 'user':
                    key = `usr-${ticket.userId}`; 
                    break;
                case 'priority':
                    key = ticket.priority;
                    break;
                default:
                    key = ticket.status;
            }
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(ticket);
        });
        return grouped;
    };

    const renderGroupHeader = (groupKey, isStatus, isPriority) => {
        const label = isStatus ? statusLabels[groupKey] : isPriority ? priorityLabels[groupKey] : groupKey;
        const icon = isStatus ? statusIcons[groupKey] : isPriority ? priorityIcons[groupKey] : null;

        return (
            <div className="group-header">
                {icon && <img src={icon} alt={`${label} icon`} className="icon" />}
                <h3>{label}</h3>
            </div>
        );
    };

    const handleGroupingChange = (e) => {
        setGrouping(e.target.value);
    };

    const handleSortingChange = (e) => {
        setSorting(e.target.value);
    };

    const sortTickets = (group) => {
        return group.sort((a, b) => {
            if (sorting === 'priority') {
                return b.priority - a.priority;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
    };

    const groupedTickets = groupTickets();

    return (
        <div className="kanban-board">
            <header>
                <div className="dropdown-container">
                    <label>Group By:</label>
                    <select value={grouping} onChange={handleGroupingChange}>
                        <option value="status">Status</option>
                        <option value="user">User</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
                <div className="dropdown-container">
                    <label>Sort By:</label>
                    <select value={sorting} onChange={handleSortingChange}>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </header>
            <div className="ticket-container">
                {Object.keys(groupedTickets).length > 0 ? (
                    Object.keys(groupedTickets).map((key) => (
                        <div key={key} className="group">
                            {renderGroupHeader(key, grouping === 'status', grouping === 'priority')}
                            {sortTickets(groupedTickets[key]).map((ticket) => (
                                <div key={ticket.id} className="ticket">
                                    <h4>{ticket.title}</h4>
                                    <p>{priorityLabels[ticket.priority]}</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No tickets available</p>
                )}
            </div>
        </div>
    );
};

export default KanbanBoard;
