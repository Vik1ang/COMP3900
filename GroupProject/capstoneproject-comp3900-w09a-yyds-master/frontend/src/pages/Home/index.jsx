import React, { useState } from 'react'
import './index.css'
import { Layout, Modal, Row, Col, Card, Button, Input, Form, Upload, Select, message } from 'antd';
import { UpCircleOutlined, FieldTimeOutlined, HeartOutlined, StarOutlined, UploadOutlined } from '@ant-design/icons';
import FoodList from '../../components/FoodList';
import StyledHeader from '../../components/StyledHeader'
import ChineseFood from '../../components/ChineseFood'
import RecipeDetail from '../RecipeDetail'
import Profile from '../../components/Profile';
import Password from '../../components/Password'
import JapaneseFood from '../../components/JapaneseFood'
import FetchFunc from '../../components/fetchFunc';
import EditRecipe from '../../components/EditRecipe';
import MyRecipe from '../../components/MyRecipe';
import MyLikes from '../MyLikes';
import { Switch, Route } from 'react-router-dom';
import Main from '../Main';
import axios from 'axios';
import Searchresult from '../../components/Searchresult';
import Cake from '../../components/Cake';
import { TextPopup } from '../../components/TextPopup';
import { useHistory } from 'react-router-dom';
import Noodle from '../../components/Noodle'
import Needhelp from '../../components/Needhelp';


const FormData = require('form-data')
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Meta } = Card;







export default function Home  ()  {

    const history = useHistory()
    //const tags_res = getTags()

 
    //表单数据收集
    const token = localStorage.getItem('token')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState() 
    const [title, setTitleInputs] = React.useState('');
    const [tags_list, setTags_listInputs] = React.useState();
    const [tags_select, setTags_select] = React.useState();
    const [introduction, setIntroductionInputs] = React.useState('');
    const [ingredients, setIngredientsInputs] = React.useState('');
    const [method, setMethodInputs] = React.useState('');

    const [timeDuration, setTimeDurationInputs] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    //var imagedata = document.querySelector('input[type ="file"]').files[0];
    function gotoLogin() {

       

    }

    function getTags(setTagsInputs) {
            const result = FetchFunc('tags/tag_list', 'GET', null, null);
            var children = [];
            result.then((data) => {
            if (data.status === 200) {
                data.json().then(res => {
                    
                    for (let i = 0 ; i < res.tags.length; i++) {
                        children.push(<Option key={ res.tags[i] }>{ res.tags[i]  }</Option>);
                    }
                    //console.log(children)

                    setTags_listInputs(children)
                    
                })
            }
            })
            .catch(err => console.error('Caught error: ', err))


    }
    const [form] = Form.useForm();

    const showModal = () => {
        if (token===null) {

            setOpen1(true)
        }else{

            setIsModalVisible(true);
            getTags(setTags_listInputs)
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onFinish = async (values) => {
        

    };
    // var children = [];
    // for (let i = 10; i < 15; i++) {
    //     children.push(<Option key={ i.toString(36) + i }>{ i.toString(36) + i }</Option>);
    // }

    function handleChange(value) {
        setTags_select(value);
        console.log(`selected ${value}`);
    }



    const onChange = (e) => {
        // setFileList(newFileList);
        // console.log(fileList)
        console.log(e.target.files)
        setFileList(e.target.files)
        console.log(fileList)
    };
    const handleClick = () => {
        
        var FormData = require('form-data');
        var formData = new FormData();

        // const jsonData = JSON.stringify({
        //     title: 'test title',
        //     introduction: '12131',
        //     ingredients: '1321321',
        //     method: '2321321',
        //   });
        if(fileList!==undefined){
            for(let i=0;i<fileList.length;i++){
                formData.append('uploadPhotos', fileList[i]);
            }
        }
        //formData.append('uploadPhotos', fileList[0]);
        
       
        formData.append('jsonData',new Blob ([JSON.stringify({
            title: title,
            introduction: introduction,
            ingredients: ingredients,
            method: method,
            tags:tags_select,
            timeDuration: timeDuration

          })], {type:"application/json"}));

    
        if(fileList!==undefined& title !== "" & introduction !==  "" & ingredients!== "" & method!== "" & tags_select!== "" & timeDuration!=="" & timeDuration < 1000){
                setIsLoading(true)
                axios.post(
                        'http://localhost:8080/recipe/postRecipe',
                        formData,
                        {
                            headers: {
                                "token": token, //Authorization
                                "Content-Type": "multipart/form-data",
                                "type": "formData"
                            },                    
                        }
                    )
                    .then(res => {
                        setIsLoading(false)
                        form.resetFields()
                        setOpen(true)
                        // setIsModalVisible(false);
                        console.log(`Success` + res.data);
                        
                        
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
                 
        }

    
    return <Layout className="layout">
        
        <StyledHeader showModal={showModal} />
        <div style={ { width: 1200, margin: '0 auto' } }>
                                 <TextPopup
                                    open={ open1 }
                                    setOpen={ setOpen1 }
                                    title='Sorry'
                                    msg={'Your need to login to do this action :) !'}
                                    newButtonMsg={'Go to Sign in'}
                                    newButtonFun = {gotoLogin()}
                                    />
            <Content style={ { padding: '0 50px' } }>
                <Switch>
                    <Route path='/home' exact>
                        <UpCircleOutlined className='upload' onClick={ showModal } />
                        <Main />
                    </Route>
                    <Route path='/home/help' exact>
                        <Needhelp />
                    </Route>
                    <Route path='/home/chinesefood' exact>

                        <ChineseFood /> 
                    </Route>
                    <Route path='/home/janpnesefood' exact>
                        <JapaneseFood/>
                    </Route>
                    <Route path='/home/cake' exact>
                        <Cake/>
                    </Route>
                    <Route path='/home/noodles' exact>
                        <Noodle/>
                    </Route>
                    <Route path='/home/searchresult/:cur_recipeId' exact>
                        
                        <Searchresult /> 
                    </Route>
                    <Route path='/home/recipedetail/:cur_recipeId' exact>

                        <RecipeDetail /> 
                    </Route>
                    <Route path='/home/editrecipe/:recipeId' exact>
                        <EditRecipe />
                    </Route>
                    <Route path='/home/myrecipe/:recipeId' exact>
                        <MyRecipe />
                    </Route>
                    <Route path='/home/mylikes' exact>
                        <MyLikes/>
                    </Route> 
                    <Route path='/home/profile' exact>
                        <Profile />
                    </Route>
                    <Route path='/home/password' exact>
                        <Password />
                    </Route> 

                </Switch>

            </Content>
            <Modal footer={ null } title="Upload Recipe" visible={ isModalVisible } onOk={ handleOk } onCancel={ handleCancel }>
                <Form
                    name="basic"
                    form = {form}
                    labelCol={ { span: 8, } }
                    wrapperCol={ { span: 14 } }
                    initialValues={ { remember: true } }
                    onFinish={ onFinish }
                >
                    <Form.Item
                        label="upload Photo/video"
                        name="Upload"
                        valuePropName="fileList"
                        rules={ [{ required: true, message: 'Need choose at least one photo!' }] }
                    >
                        {/* <Upload
                            // fileList={fileList}
                            // onChange={ onChange }
                            // name="logo"
                            // action="/upload.do"
                            // listType="picture"
                            {...props}
                        > */}
                        <div>
                            <input
                                // icon={ <UploadOutlined /> }
                                onChange = { onChange }
                                type='file'
                                multiple='True'
                            />
                                {/* Click to upload */}
                        </div>
                        {/* </Upload> */}
                    </Form.Item>
                    <Form.Item
                        label="recipe title"
                        name="title"
                        hasFeedback
                        rules={ [{ required: true, message: 'Need input recipe title!' },{
                            max: 50,
                            message: 'Your Titil is too long!', },] }
                        onChange={ (e) => setTitleInputs(e.target.value) }
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Select a tag!"
                        name="tag"
                        hasFeedback
                        rules={ [{ required: true, message: 'Need input tags!' }] }
                             
                    >
                        <Select mode="tags" style={ { width: '100%' } } placeholder="Tags Mode" onChange={ handleChange }> 
                            {tags_list}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Time use(mins)"
                        name="time"
                        hasFeedback
                        rules={ [{  required: true,
                            message: 'Need input time-use',
                          }, {
                            max: 3,
                            message: 'Must less then 1000', },
                            {
                                message:'Onlyt number accepted',
                                pattern: /^[0-9]+$/ }] }
                        onChange={ (e) => setTimeDurationInputs(e.target.value) }
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Introduction"
                        name="Introduction"
                        hasFeedback
                        rules={ [{ required: true, message: 'Need input Introduction!' },{
                            max: 350,
                            message: 'Your introduction is too long!', },
                            ] }
                        onChange={ (e) => setIntroductionInputs(e.target.value) }
                        
                    >
                        <TextArea ></TextArea>
                    </Form.Item>
                    <Form.Item
                        label="Ingredients"
                        name="Ingredients"
                        hasFeedback
                        rules={ [{ required: true, message: 'Need input ingredients!' }] }
                        onChange={ (e) => setIngredientsInputs(e.target.value) }
                    >
                        
                        
                        <TextArea ></TextArea>
                    </Form.Item>
                    <Form.Item
                        label="Method"
                        name="Method"
                        hasFeedback
                        rules={ [{ required: true, message: 'Need input method!' }] }
                        onChange={ (e) => setMethodInputs(e.target.value) }
                    >
                        
                        
                        <TextArea ></TextArea>
                    </Form.Item>
                    <TextPopup
                    open={ open }
                    setOpen={ setOpen }
                    title='Congratulations'
                    msg={'Your recipe has been Submit Successfully'}
                    />
                    <Form.Item style={ { marginTop: 20 } } wrapperCol={ { offset: 6, span: 8 } }>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            onClick={() => handleClick() }
                        >
                            submit
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
        
    </Layout>

}
// export default Home;