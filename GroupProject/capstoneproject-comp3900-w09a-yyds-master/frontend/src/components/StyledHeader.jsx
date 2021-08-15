import React from 'react'
import { Layout, Menu, Dropdown, Input, Button} from 'antd';
import {Link} from 'react-router-dom'
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import FetchFunc from './fetchFunc';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import logout from './logout';
import { useHistory } from 'react-router-dom';
import { TextPopup } from './TextPopup';

const { Header} = Layout;
const { Search } = Input;


const StyledHeader = (props) => {
  const url = window.location.href.split('/')
  const cur = url[url.length - 1]
  console.log('xxxxx1321312',cur)
    const [open, setOpen] = React.useState(false);
    const GotoDetial = ( )=>{
      const token= localStorage.getItem('token');
      if (token=== null){
          setOpen(true) }
    }
    const userId = localStorage.getItem('userId');
    const menu = (
        <Menu>
            <Menu.Item  onClick={()=>GotoDetial()}>
                <Link to='/home/chinesefood'>Chinese food</Link>
            </Menu.Item>
            <Menu.Item onClick={()=>GotoDetial()}>
          
                <Link to='/home/janpnesefood'>Japanese food</Link>
            </Menu.Item >
            <Menu.Item onClick={()=>GotoDetial()}>
            <Link to='/home/noodles'>Noodles</Link>
            </Menu.Item>
            <Menu.Item onClick={()=>GotoDetial()}>
              <Link to='/home/cake'>Cake</Link>
            </Menu.Item>
        </Menu>
    );
    const menu2 = (
        <Menu>
            <Menu.Item onClick={()=>GotoDetial()}>
              <Link to='/home/profile'>Customise Profile</Link>
                {/* <a>Customise Profile</a> */}
            </Menu.Item>
            <Menu.Item onClick={()=>GotoDetial()}>
              <Link to='/home/password'>Change Password</Link>
                {/* <a>Customise Profile</a> */}
            </Menu.Item>
            <Menu.Item onClick={()=>GotoDetial()}>
                <Link to={'/home/myrecipe/' + userId}>My Recipe</Link>
            </Menu.Item>
            <Menu.Item onClick={()=>GotoDetial()}>
              
                <Link to={'/home/mylikes/'}>My Likes</Link>   
            </Menu.Item>
            <Menu.Item>
                <a onClick = {props.showModal}>Upload Recipe</a>
            </Menu.Item>
        </Menu>
    );


    const history = useHistory()
    const onSearch = value => {

          
          GotoDetial()
      
          console.log(value);

          // axios.get('http://localhost:8080/recipe/recipe_list?pageNum=1&pageSize=9&search=${value}').then(
          //   response =>{console.log('success',response.data);},
          //   error => {console.log('fail',error);}
          // )
    
      // post the request
        const result = FetchFunc(`recipe/recipe_list?pageNum=1&pageSize=9&search=${value}`, 'GET', token, null);
        console.log(result)
        result.then((data) => {
          console.log(data);
          if (data.status === 200) {
            data.json().then(res => {

              console.log('request success');
              // history.push('/home/searchresult/' + value)
              window.location.href = '/home/searchresult/' + value;
            })
          }
        })
        .catch(err => console.error('Caught error: ', err))
      
 
    }
    const token = localStorage.getItem('token')
    const avatar = localStorage.getItem('avatar')
    const handleClick = () => {
      history.push('/home/profile');
    }
    const gotoSignin = () => {
      window.location.href = '/';
    }
  return (
    
    <Header style={ { backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } } >
      <TextPopup
        open={ open }
        setOpen={ setOpen }
        title='Sorry'
        msg={'Your need to login to do this action :) !'}
        newButton={true}
        newButtonMsg={'Sign In'}
        newButtonFun={() => gotoSignin()}
      />
      <div style={ { display: 'flex', alignItems: 'center' } }>
        <div className="logo" > <Link to='/home'>YYDS</Link></div>
        <Dropdown overlay={ menu }>
          <span className="dropdown" onClick={ e => e.preventDefault() }>
            Recipe <DownOutlined />
          </span>
        </Dropdown>
        <Dropdown overlay={ menu2 }>
          <span className="dropdown" onClick={ e => e.preventDefault() }>
            My profile <DownOutlined />
          </span>
        </Dropdown>
        <Search style={ { width: 200 } } placeholder="input search text" onSearch={ onSearch } enterButton />
      </div>
      <div style={ { display: 'flex', alignItems: 'center' } }> 
        
        <div style={ { float: 'right' , cursor: 'pointer', marginRight: '10px' } }>

          {
          cur !==''&&(

          <div>{token===null && <Button type="primary"  onClick={() => gotoSignin()} >Sign In</Button>}</div>
          )}


          {token && <Avatar src={avatar} onClick={() => handleClick()}/>}
        </div>
        <div>
          {token && <ExitToAppIcon style={ { float: 'right' , cursor: 'pointer', marginRight: '0px', top: '50%', bottom: '50%', width: '30px', height: '30px' }} onClick={() => logout(token)}/>}
        </div>
      </div>
    </Header>
  )
}
export default StyledHeader;