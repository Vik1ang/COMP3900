import React, { useState} from 'react'
import {  Card, Button } from 'antd';
import { FieldTimeOutlined, HeartOutlined, StarFilled ,HeartFilled} from '@ant-design/icons';
import FetchFunc from '../../components/fetchFunc';
import { useHistory } from 'react-router-dom';
const { Meta } = Card;



const data1 = [
    { recipePhotos:['/assets/img/recipe1.png','/assets/img/recipe2.png'],isLiked:0,likes:10, title: 'AAA', introduction: 'AAAsimple decoration', timeDuration: '11', rateScore: 2 },
    { recipePhotos: ['/assets/img/recipe2.png','/assets/img/recipe1.png'],isLiked:1,likes:20, title: 'BBB', introduction: 'BBBsimple decoration', timeDuration: '20', rateScore: 3 },
    { recipePhotos: ['/assets/img/recipe3.png','/assets/img/recipe1.png'],isLiked:0,likes:100, title: 'CCC', introduction: 'CCCsimple decoration', timeDuration: '25', rateScore: 5 }, 
    { recipePhotos: ['/assets/img/recipe1.png','/assets/img/recipe3.png'],isLiked:0,likes:10, title: 'AAA', introduction: 'AAAsimple decoration', timeDuration: '15', rateScore: 2 },
    { recipePhotos:['/assets/img/recipe2.png'],isLiked:1,likes:20, title: 'BBB', introduction: 'BBBsimple decoration', timeDuration: '20', rateScore: 3 },
    { recipePhotos: ['/assets/img/recipe3.png'],isLiked:0,likes:100, title: 'CCC', introduction: 'CCCsimple decoration', timeDuration: '25', rateScore: 5 },
  ]

  

function getMylikes (token,setData) {

    const result = FetchFunc(`recipe/recipe_list?is_liked=1`, 'GET', token,null);
    result.then((data) => {
        console.log('response is ',data);
        if (data.status === 200) {
            
            data.json().then(res => {


                setData(data => [...data, res.recipe_lists])

                console.log('Get data success')

                // console.log('I got the recipe ditails',res.recipe_lists[0])
                

            
            // console.log('res content', res);

            // console.log('res.recipe_lists  ',res.recipe_lists)
            })
          
        }
    })
}



const MyLikes = () => {
    const history = useHistory()
    const GotoDetial = (cur_recipeId,history )=>{
        history.push('/home/recipedetail/' + cur_recipeId)
      }
    const [recipelist,setData] = useState([])
    const token = localStorage.getItem('token');

    React.useEffect(()=>{ 
        getMylikes (token,setData,)
      },[])


const like = (i)=>{
        let d = [...recipelist];
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
    
            const payload = JSON.stringify({
              recipeId:recipeId
            });
            const result = FetchFunc(`recipe/like`, 'POST', token, payload);
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

    return (
        <div >
            <h1><h2 className='subtitle'>My Likes</h2>
            <p style={ { textAlign: 'center',fontSize:20 } }>Here are the recipes you like</p>
            </h1>
            {/* <h2 style={ { textAlign: 'center' } }><Link to='/home/foodlist' className='gomore'>Easy Dinners</Link></h2> */}
            <div className="foodlist">
                {
                    recipelist.map((recipes)=>(
                        recipes.map((recipe,idx)=>(
                                <Card
                                    key={idx}
                                    hoverable
                                    style={ { width: '30%',margin: '10px 1.5% 0' } }
                                    cover={ <img onClick={()=>GotoDetial(recipe.recipeId,history)} style={ { height: 298 } } alt="example" src={recipe.recipePhotos[0]} /> }
                                >
                                    <Meta onClick={()=>GotoDetial(recipe.recipeId,history)} title={recipe.title} description={recipe.introduction} />
                                    <div className='ope'>
                                        <span style={ { display: 'flex', alignItems: 'center' } }><FieldTimeOutlined style={{color: '#197574'}} />{recipe.timeDuration}mins</span>
                                        {/* <span onClick={()=>props.FillHeart(idx)} style={ { display: 'flex', alignItems: 'center' } }>
                                            {props.fillheart?<HeartFilled style={{color: '#f00',marginRight:5}}/>:<HeartOutlined style={{marginRight:5}}/>}{recipe.likes}
                                            
                                        </span> */}
                                     <span onClick={()=>like(idx)} style={ { display: 'flex', alignItems: 'center' } }>{recipe.likes}{recipe.isLiked?<HeartFilled style={{color: '#f00',marginRight:5}}/>:<HeartOutlined style={{marginRight:5}}/>}
                                     {recipe.isLiked?<Button type="link" style={{color: '#197574'}} >Unlike</Button>:<Button type="link">Relike</Button>}
                                     </span>
                                     
                                    </div>
                                </Card>

                        ))
                    ))
                    
                }
                

            </div>
        </div>
    )

}

    export default MyLikes;