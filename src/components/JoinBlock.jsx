import React from 'react';
import axios from "axios";

function JoinBlock({ onLogin }) {
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert('On of the fields is empty');
        }
        const obj = {
            roomId,
            userName
        }
        setLoading(true);
        await axios.post('/rooms', {
            roomId,
            userName
        });
        onLogin(obj);
    }

    return (
        <div className="join-block">
            <div className="input-group mb-3 inputProp">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Room Id</span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    placeholder='Room ID'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}/>
            </div>

            <div className="input-group mb-3 inputProp">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Username</span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    placeholder='Username'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}/>
            </div>

            <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
                {isLoading ? 'Entering...' : 'Enter'}
            </button>
        </div>
    )
}

export default JoinBlock;