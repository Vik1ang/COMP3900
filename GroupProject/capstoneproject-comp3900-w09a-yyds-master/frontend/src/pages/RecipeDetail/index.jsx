import React, { useState, createElement } from 'react'
import './index.css'
import {Tag, Layout, Modal, Row, Col, Card, Carousel, Button, Input, Form, Upload, Select, message, Comment, Avatar, Tooltip, List, Alert, Image } from 'antd';
import { TagsOutlined, PrinterOutlined, StarFilled, StarOutlined, ClockCircleFilled, CheckCircleFilled, ToolFilled, ConsoleSqlOutlined } from '@ant-design/icons';
import FoodList from '../../components/FoodList';
import StyledHeader from '../../components/StyledHeader'
import ChineseFood from '../../components/ChineseFood'
import { Switch, Route } from 'react-router-dom';
import FetchFunc from '../../components/fetchFunc';
import moment from 'moment';
import Main from '../Main';
import axios from 'axios';
import Comments from '../../components/Comments';
import { Typography } from 'antd';

const { Title } = Typography;
const FormData = require('form-data')

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Meta } = Card;

function addComments(token, recipeId, NewComments, setNewComments, setAdded, added) {
    const payload = JSON.stringify({
        recipeId: recipeId,
        content: NewComments
    });
    const result = FetchFunc('recipe/comment', 'POST', token, payload);
    result.then(data => {
        if (data.status === 200) {
            setNewComments('')
            console.log('success')
            setAdded(!added)
            // window.location.href = window.location.href;
        }
    })
} 
// function getRecipeDetail(){
//     const result = fetchFunc(`recipe/recipe_list?pageNum=1&pageSize=9&search=${props.}`)
// }



function getDetial(token,cur_recipeId,
                    setPhotoList,
                    setTitle, 
                    setrateScore,
                    settimeDuration,
                    setintroduction,
                    setingredients,
                    setmethod,
                    settags,
                    setnickName,
                    setComments,
                    setmyRateScore,
                    setisRated,
                    setState,
                    initialState
                    ) {

    const result = FetchFunc(`recipe/recipe_list?recipeId=${cur_recipeId}`, 'GET', token,null);
    result.then((data) => {
        console.log('response is ',data);
        if (data.status === 200) {
            
            data.json().then(res => {
                setisRated(res.recipe_lists[0].isRated)
                setmyRateScore(res.recipe_lists[0].myRateScore)
                setrateScore(res.recipe_lists[0].rateScore)
                setPhotoList( res.recipe_lists[0].recipePhotos)
                settimeDuration(res.recipe_lists[0].timeDuration)
                setTitle(res.recipe_lists[0].title)
                setintroduction(res.recipe_lists[0].introduction)

                setingredients(res.recipe_lists[0].ingredients)
                setmethod(res.recipe_lists[0].method)

                settags(res.recipe_lists[0].tags)

                setnickName(res.recipe_lists[0].nickName)
                console.log('I got the recipe ditails',res.recipe_lists[0].tags)
                console.log(res.recipe_lists[0].comments)
                // var key = 0; key < res.recipe_lists[0].comments.length; key++
                // var key in res.recipe_lists[0].comments
                for (var key = 0; key < res.recipe_lists[0].comments.length; key++) {
                    if (initialState) {
                        setState(false);
                    } else {
                        key = res.recipe_lists[0].comments.length - 1
                    }
                    var comment = res.recipe_lists[0].comments[key];
                    var payload = {
                        author: comment.nickName,
                        avatar: (<Avatar
                                src={<Image src={comment.profilePhoto} />}
                                alt={comment.nickName}
                                />),
                        content: (
                            <p>
                            {comment.content}
                            </p>
                        ),
                        datetime: (
                            <Tooltip title={moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(comment.createTime).fromNow()}</span>
                            </Tooltip>
                        ),
                    }
                    console.log(payload)
                    setComments(coms => [...coms, payload])
                }
            })
        }
    })
}



const RecipeDetail = () => {
    const contentStyle = {
        height: '400px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };





    const url = window.location.href.split('/')
    const cur_recipeId = url[url.length - 1]
    const [rate, setRate] = useState(0)
    const [newComments, setNewComments] = useState('');
    const [photolist, setPhotoList] = useState([]);
    const [title, setTitle] = useState('');
    const [rateScore, setrateScore] = useState('');
    const [timeDuration, settimeDuration] = useState('');
    const [introduction, setintroduction] = useState('');
    const [ingredients, setingredients] = useState('');
    const [method, setmethod] = useState('');
    const [tags, settags] = useState([]);
    const [nickName, setnickName] = useState('');
    const [comments, setComments] = useState([]);
    const [isRated, setisRated] = useState(0);
    const [myRateScore, setmyRateScore] = useState(null);
    const [added, setAdded] = useState(true);
    const [initialState, setState] = useState(true);
    const avatat = localStorage.getItem('avatar');

    const token = localStorage.getItem('token');
 
    const data = [
        '/assets/img/recipe1.png',
        '/assets/img/recipe2.png',
        '/assets/img/recipe3.png',
    ]
     



    React.useEffect(()=>{ 
        getDetial(token,cur_recipeId,setPhotoList,setTitle,setrateScore,settimeDuration,setintroduction,setingredients,setmethod,settags,setnickName, setComments,setmyRateScore,setisRated, setState, initialState)
      },[added])
    console.log(comments)
    //   let d = [...photolist];
    //   console.log('sssssssssssssssssssss',photolist)
      

    const handleOnchange = (e) => {
        setNewComments(e.target.value)
    }
    const sentScore = (token,rate ) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxI click',rate)

        const payload = JSON.stringify({
            rateScore: rate,
            recipeId: cur_recipeId
          });

        const result = FetchFunc(`recipe/rate`, 'Post', token, payload);
            console.log('token is :',token)
            result.then((data) => {
            console.log(data);
            if (data.status === 200) {
               
                
                setisRated(1)
                setmyRateScore(rate)
        
                
                console.log('xxxxxxxxxxxxxxxxxxxxxxxx rate post success');

                // console.log('res.recipe_lists  ',res.recipe_lists)
                
            }
        })




    }

    return (
        <div>
            <div className='recipedetail'>
                <div className='imgshow'>
                    <div className='imgbox'>
                        <Carousel autoplay effect="fade" arrows={true}>{
                        
                        photolist.map((i)=>(
                            <div>       
                                <img style={{maxWidth:500, maxHeight:400,minWidth:400,minHeight:400, object_fit:'contain' }} src= {i} alt="" />
                            </div>                          
                            ))       
                        }

                        </Carousel>
                    </div>
                    <div className='imgbox'>
                    <h1 className='h1'>
                        {introduction}
                    </h1>
                    </div>
                </div>
                
                <div className="recipeDec">
                    <Title level={1}>{title}</Title>
                    <div>by <span className='author'>{nickName}</span></div>
                    <div className='rate'>
                        <span>Rating:   {rateScore} </span>
                        <span>
                            <span style={ { marginRight: 10 } }>Rate:</span>
                            {isRated?
                                                    <span>
                                                            {
                                                                
                                                                    (new Array(5)).fill('').map((val, i) => {
                                                                        if (i < myRateScore) {
                                                                            return <StarFilled  style={ { color: '#f4bf1f' } } />
                                                                        } else {
                                                                            return <StarOutlined  style={ { color: '#f4bf1f' } } />
                                                                        }
                                                                        }
                                                                    )
                                                            }
                                                    </span>:                                
                            
                                                    <span>
                                                            {
                                                                
                                                                    (new Array(5)).fill('').map((val, i) => {
                                                                        if (i < rate) {
                                                                            return <StarFilled onMouseOver={ () => setRate(i + 1) } style={ { color: '#f4bf1f' } } />
                                                                        } else {
                                                                            return <StarOutlined onMouseOver={ () => setRate(i + 1) } style={ { color: '#f4bf1f' } } />
                                                                        }
                                                                        }
                                                                    )
                                                            }
                                                    </span>}

                        </span>
                        {isRated?<Tag color="#87d068">Your score</Tag>:<Button onClick={() => sentScore(token, rate)}style={ { backgroundColor: '#be2a77', color: '#fff' } } size='small'>Submit</Button>}
                        
                    </div>

                    <div className='icons'>
                        <div>
                            <ClockCircleFilled style={ { color: '#72aeb2', fontSize: 25 } } />
                            <div>
                                <h3 className='h3'>Time use：{timeDuration}</h3>
                            </div>
                        </div>

                    </div>

                    <div><h4 className='h4'>Ingredients:</h4>{ingredients}</div>
                    <div><h4 className='h4'>Methdd:</h4>{method}</div>
                    <h4 className='h4'>Recipe Tags:</h4>
                    <div className='nut' >
                            
                                {
                                tags.map((tag)=>(
                                <div> 
                                    <TagsOutlined/>
                                    <div >      
                                    {tag}
                                    </div>
                                </div>                          
                                ))    
                                }
                            
                    </div>
                </div>
            </div>
            <Comments comments={comments}/>
            <div>
                {/* {comments.length > 0 && <CommentList comments={comments} />} */}
                <Comment
                    avatar={
                        <Avatar
                        src={<Image src={avatat} />}
                        alt="Han Solo"
                        />
                    }
                    content={
                        <div>
                            <Form.Item>
                                <TextArea rows={4} onChange={e => handleOnchange(e)} value={newComments} />
                                </Form.Item>
                                <Form.Item>
                                <Button htmlType="submit" onClick={() => addComments(token, cur_recipeId, newComments, setNewComments, setAdded, added)} type="primary">
                                    Add Comment
                                </Button>
                            </Form.Item>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

export default RecipeDetail;