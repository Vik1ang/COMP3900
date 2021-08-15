import React from 'react'
import {  Card } from 'antd';
import { FieldTimeOutlined, HeartOutlined, StarFilled ,HeartFilled} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { TextPopup } from './TextPopup';
// import LikeHeart from './LikeHeart';
const { Meta } = Card;



const FoodList = (props) => {
    // console.log('recipelist is  ',props.data[0]['0']['recipePhotos'])
    // for (var e in props.data[0]) {
    //     console.log(e)
    const history = useHistory()

    const [open, setOpen] = React.useState(false);

    const GotoDetial = (cur_recipeId,history )=>{
        const token= localStorage.getItem('token');
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
            setOpen(true) }else{
        history.push('/home/recipedetail/' + cur_recipeId)
      }
    }

    return (
        <div >
            {/* <h2 style={ { textAlign: 'center' } }><Link to='/home/foodlist' className='gomore'>Easy Dinners</Link></h2> */}
            <div className="foodlist">
                {
                    props.data.map((recipes)=>(
                        recipes.map((recipe,idx)=>(
                                <Card
                                    key={idx}
                                    hoverable
                                    style={ { width: '30%',margin: '10px 1.5% 0' } }
                                    cover={ <img  onClick={()=>GotoDetial(recipe.recipeId,history)} style={ { height: 298 } } alt="example" src={recipe.recipePhotos[0]} /> }
                                >
                                    <Meta onClick={()=>GotoDetial(recipe.recipeId,history)} title={recipe.title} description={recipe.introduction} />
                                    <div className='ope'>
                                        <span style={ { display: 'flex', alignItems: 'center' } }><FieldTimeOutlined style={{color: '#197574'}} />{recipe.timeDuration}mins</span>
                                        {/* <span onClick={()=>props.FillHeart(idx)} style={ { display: 'flex', alignItems: 'center' } }>
                                            {props.fillheart?<HeartFilled style={{color: '#f00',marginRight:5}}/>:<HeartOutlined style={{marginRight:5}}/>}{recipe.likes}
                                            
                                        </span> */}
                                     <span onClick={()=>props.like(idx)} style={ { display: 'flex', alignItems: 'center' } }>{recipe.isLiked?<HeartFilled style={{color: '#f00',marginRight:5}}/>:<HeartOutlined style={{marginRight:5}}/>}{recipe.likes}</span>
                                        <span>
                                            {
                                                (new Array(5)).fill('').map((val,i)=>{
                                                    if(i<recipe.rateScore){
                                                        return <StarFilled style={{color:'#197574'}} />
                                                    }else{
                                                        return <StarFilled style={{color:'#aecbd1'}} />
                                                    }
                                                    

                                                }
                                                )
                                            }
                                        </span>
                                    </div>
                                    <TextPopup
                                    open={ open }
                                    setOpen={ setOpen }
                                    title='Sorry'
                                    msg={'Your need to login to do this action :) !'}
                                    />
                                </Card>
                                

                        ))
                    ))
                }
                

            </div>
        </div>
    )
}

export default FoodList
