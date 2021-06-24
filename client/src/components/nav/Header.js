import { useState } from 'react';
import { Menu, Badge } from 'antd';
import {
    HomeOutlined,
    SettingOutlined,
    UserAddOutlined,
    UserOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Item from 'antd/lib/list/Item';
import Search from '../forms/Search';

const { SubMenu } = Menu;

function Header() {
    const [current, setCurrent] = useState('home');
    const dispatch = useDispatch();
    const { user, cart } = useSelector(state => ({ ...state }));

    const history = useHistory();

    const handleClick = (e) => {
        // console.log(e.key);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();

        dispatch({
            type: 'LOGOUT',
            payload: null
        });
        history.push('/login');
    };

    return (
        <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
        >
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>

            <Menu.Item key="shop" icon={<ShoppingOutlined />}  >
                <Link to="/shop">Shop</Link>
            </Menu.Item>

            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}  >
                <Link to="/cart">
                    <Badge count={cart.length} offset={[12, -2]}>
                        Cart
                    </Badge>
                </Link>
            </Menu.Item>

            {!user && (
                <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right" >
                    <Link to="/register">Register</Link>
                </Menu.Item>
            )}

            {!user && (
                <Menu.Item key="login" icon={<UserOutlined />} className="float-right" >
                    <Link to="/login">Login</Link>
                </Menu.Item>
            )}

            {user && (
                <SubMenu
                    key="SubMenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split("@")[0]}
                    className="float-end"
                >
                    {user && user.role === "subscriber" && (
                        <Item>
                            <Link to="/user/history">Dashboard</Link>
                        </Item>
                    )}
                    {user && user.role === "admin" && (
                        <Item>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Item>
                    )}

                    <Menu.Item icon={<LogoutOutlined />} onClick={logout}>Logout</Menu.Item>
                </SubMenu>
            )}
            <span className="float-end p-1">
                <Search />
            </span>
        </Menu>
    )
}

export default Header

