import React from 'react';
import { List, Tooltip, Comment } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';


export default function Comments({ comments }) {

    return (
        <div>
            <List
                header={`${comments.length} replies`}
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={item => (
                <li>
                    <Comment
                        author={item.author}
                        avatar={item.avatar}
                        content={item.content}
                        datetime={item.datetime}
                    />
                </li>
                )}
            />
        </div>
    )
}

Comments.propTypes = {
    comments: PropTypes.array
};