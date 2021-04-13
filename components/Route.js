import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import Login from './Login';
import Stripe from './Stripe';


const Route = createStackNavigator(
  { 
	Login:Login,
	Stripe:Stripe
  },
  {
  headerMode: 'none',
  }
);

export default createAppContainer(Route);