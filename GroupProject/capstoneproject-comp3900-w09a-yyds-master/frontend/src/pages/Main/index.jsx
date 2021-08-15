import React, { useState } from 'react'
import { Row, Col, Card,Alert, Button, Space  } from 'antd';
import { NavLink as Link } from 'react-router-dom'
import { FieldTimeOutlined, HeartOutlined, HeartFilled,StarFilled, ImportOutlined } from '@ant-design/icons';
import FoodList from '../../components/FoodList';
import FetchFunc from '../../components/fetchFunc';
import { useHistory } from 'react-router-dom';
import { TextPopup } from '../../components/TextPopup';

const { Meta } = Card;

const cur_recipeId = 'e25b10db18fd41669b3172272b593ea0'
function getInfo(token,setData,setData1,setData2,setData3,setbigrecipe_photo) {

    // post the request
    console.log('token now is ', token);
    const result = FetchFunc(`visitor/recipe_list`, 'GET', null, null);
    console.log(result)
    result.then((data) => {
      console.log(data);
      if (data.status === 200) {
        data.json().then(res => {
          // console.log('res content', res);
          // console.log('res.top_likes_list content', res.top_likes_list);
          // console.log('res.top_likes_list.list content', res.top_likes_list.list);
          // console.log('res.top_likes_list content', res.top_likes_list.list.recipeId);
          setData(data => [...data, res.easy_recipe_list.list])
          
          setData1(data => [...data, res.top_rates_list.list])
          setData2(data => [...data, res.top_likes_list.list])
          setData3(res.random_recipe_list.list[0])

          console.log('xxxxxxxxxxxxxxxxxxxxx',  res.random_recipe_list.list[0]);
          
          
        
          
          // console.log('res.recipe_lists  ',res.recipe_lists)
        })
      }
    })
    .catch(err => console.error('Caught error: ', err))
}




// const data1 = [
//     { recipePhotos:['/assets/img/recipe1.png','/assets/img/recipe2.png'],isLiked:0,likes:10, title: 'AAA', introduction: 'AAAsimple decoration', timeDuration: '11', rateScore: 2 },
//     { recipePhotos: ['/assets/img/recipe2.png','/assets/img/recipe1.png'],isLiked:1,likes:20, title: 'BBB', introduction: 'BBBsimple decoration', timeDuration: '20', rateScore: 3 },
//     { recipePhotos: ['/assets/img/recipe3.png','/assets/img/recipe1.png'],isLiked:0,likes:100, title: 'CCC', introduction: 'CCCsimple decoration', timeDuration: '25', rateScore: 5 }, 
//     { recipePhotos: ['/assets/img/recipe1.png','/assets/img/recipe3.png'],isLiked:0,likes:10, title: 'AAA', introduction: 'AAAsimple decoration', timeDuration: '15', rateScore: 2 },
//   ]
const Main = () => {
    const [open, setOpen] = React.useState(false);
    const history = useHistory()
    const [data,setData] = useState([])
    const [toprates,setData1] = useState([])
    const [toplikes,setData2] = useState([])
    const [bigrecipe,setData3] = useState([])
    const [bigrecipe_photo,setbigrecipe_photo] = useState('/assets/img/recipe1.png')
    const token = localStorage.getItem('token');
    React.useEffect(()=>{ 
      getInfo(token,setData,setData1,setData2,setData3,setbigrecipe_photo)
    },[])

    if ( bigrecipe.recipePhotos !== undefined){
    console.log('xxxxxxxxxxxxxxxxxxxxx111111111111111111',  bigrecipe.recipePhotos[0]);
    // setbigrecipe_photo(bigrecipe.recipePhotos[0])
    }
    //页面跳转
    const GotoDetial = (cur_recipeId,history )=>{
      // console.log('xxxxxxxxxxxxx', token)
      if (token=== null){
       
          //   <Alert
          //   message="Warning Text"
          //   type="warning"
          //   action={
          //     <Space>
          //       <Button size="small" type="ghost">
          //         Done
          //       </Button>
          //     </Space>
          //   }
          //   closable
          // />
          setOpen(true)
          
        
    }
    else{
      history.push('/home/recipedetail/' + cur_recipeId)
    }
      // history.push('/home/recipedetail/' + cur_recipeId)
    }

    const GotoDetial1 = ()=>{
      // console.log('xxxxxxxxxxxxx', token)
      if (token=== null){
       
          //   <Alert
          //   message="Warning Text"
          //   type="warning"
          //   action={
          //     <Space>
          //       <Button size="small" type="ghost">
          //         Done
          //       </Button>
          //     </Space>
          //   }
          //   closable
          // />
          setOpen(true)
          history.push('/' )
        
    }
    else{
      history.push('/home/searchresult/easy' )
    }
      // history.push('/home/recipedetail/' + cur_recipeId)
    }
    const like = (i)=>{
              let d = [...data];
              // console.log('xxxxxxxxxxx',d[0][0].likes)
              
              var recipeId = d[0][i].recipeId
              
              if(d[0][i].isLiked){
                  d[0][i].isLiked = 0;
                  d[0][i].likes--;
                  console.log('recipe ID is :', d[0][i].recipeId)
                  
                  recipeId = d[0][i].recipeId
          
                  const payload = JSON.stringify({
                    recipeId:recipeId
                  });
                  const result = FetchFunc(`recipe/unlike`, 'POST', token, payload);
                  console.log(result)
                  result.then((data) => {
                    console.log('mypost unlike data is',data);
                    
                    if (data.status === 200) {
                      console.log('post unLike success')
                    }
                  })
              }else{
                  d[0][i].isLiked = 1;
                  d[0][i].likes++;
                  console.log('recipe ID is :', d[0][i].recipeId)
                  
                  recipeId = d[0][i].recipeId
          
                  var payload2 = JSON.stringify({
                    recipeId:recipeId
                  });
                  const result = FetchFunc(`recipe/like`, 'POST', token, payload2);
                  console.log(result)
                  result.then((data) => {
                    console.log('mypost data is',data);
                    if (data.status === 200) {
                      console.log('post Like success')
                    }
                  })

          
              }
              
              setData(d)
          
      }
      const like1 = (i)=>{
        let d = [...toprates];
        // console.log('xxxxxxxxxxx',d[0][0].likes)
        
        var recipeId = d[0][i].recipeId
        
        if(d[0][i].isLiked){
            d[0][i].isLiked = 0;
            d[0][i].likes--;
            console.log('recipe ID is :', d[0][i].recipeId)
            
            recipeId = d[0][i].recipeId
    
            const payload = JSON.stringify({
              recipeId:recipeId
            });
            const result = FetchFunc(`recipe/unlike`, 'POST', token, payload);
            console.log(result)
            result.then((data) => {
              console.log('mypost unlike data is',data);
              
              if (data.status === 200) {
                console.log('post unLike success')
              }
            })
        }else{
            d[0][i].isLiked = 1;
            d[0][i].likes++;
            console.log('recipe ID is :', d[0][i].recipeId)
            
            recipeId = d[0][i].recipeId
    
            var payload2 = JSON.stringify({
              recipeId:recipeId
            });
            const result = FetchFunc(`recipe/like`, 'POST', token, payload2);
            console.log(result)
            result.then((data) => {
              console.log('mypost data is',data);
              if (data.status === 200) {
                console.log('post Like success')
              }
            })

    
        }
        
        setData1(d)
    
}
const like2 = (i)=>{
  let d = [...toplikes];
  // console.log('xxxxxxxxxxx',d[0][0].likes)
  
  var recipeId = d[0][i].recipeId
  
  if(d[0][i].isLiked){
      d[0][i].isLiked = 0;
      d[0][i].likes--;
      console.log('recipe ID is :', d[0][i].recipeId)
      
      recipeId = d[0][i].recipeId

      const payload = JSON.stringify({
        recipeId:recipeId
      });
      const result = FetchFunc(`recipe/unlike`, 'POST', token, payload);
      console.log(result)
      result.then((data) => {
        console.log('mypost unlike data is',data);
        
        if (data.status === 200) {
          console.log('post unLike success')
        }
      })
  }else{
      d[0][i].isLiked = 1;
      d[0][i].likes++;
      console.log('recipe ID is :', d[0][i].recipeId)
      
      recipeId = d[0][i].recipeId

      var payload2 = JSON.stringify({
        recipeId:recipeId
      });
      const result = FetchFunc(`recipe/like`, 'POST', token, payload2);
      console.log(result)
      result.then((data) => {
        console.log('mypost data is',data);
        if (data.status === 200) {
          console.log('post Like success')
        }
      })


  }
  
  setData2(d)



}
    return (<div>
        <Row>
                                  <TextPopup
                                    open={ open }
                                    setOpen={ setOpen }
                                    title='Sorry'
                                    msg={'Your need to login to do this action :) !'}
                                    />
            <Col span={ 13 } className='rec'>
                {bigrecipe.recipePhotos!==undefined?<img style={ { width: '500',height: '500px' } }  src={bigrecipe.recipePhotos[0]} alt="" />:<img style={ { width: '500',height: '500px'  } } src={'/assets/img/Wait_p.png'} alt="" />}
              
                <div className='deco'>
                    <h2>{bigrecipe.title}</h2>
                    <p>{bigrecipe.introduction}</p>
                    
                    <Link to={ '/home/recipedetail/' + bigrecipe.recipeId} className='gomore'>Get The Recipe
                    </Link>
                </div>
            </Col>
            <Col span={ 10 } offset={ 1 }>
                <h1 style={ { textAlign: 'center' } }><Link onClick={()=>GotoDetial1()} to='/home/searchresult/easy' className='gomore'>Easy Cook</Link></h1>
                <div className="dinnerList">
                    {
                        data.map((foods) => (
                            foods.map((food, idx) => (
                                        <Card                                  
                                            
                                            key={ idx }
                                            hoverable
                                            style={ { width: '47%',marginBottom:10 } }
                                            cover={  <img onClick={()=>GotoDetial(food.recipeId,history)} style={ { height: 200 } } alt="example" src={ food.recipePhotos[0]} /> }
                                        >
                                          
                                            <Meta onClick={()=>GotoDetial(food.recipeId,history)} title={ food.title } description={ food.introduction } />
                                            <div className='ope'>
                                                <span style={ { display: 'flex', alignItems: 'center' } }><FieldTimeOutlined style={ { color: '#197574' } } />{ food.timeDuration }mins</span>
                                                <span onClick={()=>like(idx)} style={ { display: 'flex', alignItems: 'center' } }>{food.isLiked?<HeartFilled style={{color: '#f00',marginRight:5}}/>:<HeartOutlined style={{marginRight:5}}/>}{food.likes}</span>
                                            </div>
                                                <span>
                                                    {
                                                        (new Array(5)).fill('').map((val, i) => {
                                                            if (i < food.rateScore) {
                                                                return <StarFilled style={ { color: '#197574' } } />
                                                            } else {
                                                                return <StarFilled style={ { color: '#aecbd1' } } />
                                                            }
                                                        })
                                                    }
                                                </span>
                                        </Card>
                            ))
                        ))
                    }
                </div>
            </Col>
        </Row>
        <h2 className='subtitle'>Top rate recipe</h2>
            <FoodList data={ toprates } like={like1} />
        
        <h2 className='subtitle'>Top Likes Recipe</h2>
            <FoodList data={ toplikes } like={like2} />
    </div>
    )
}

export default Main
