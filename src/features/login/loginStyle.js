import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, withStyles } from '@material-ui/core/styles';

export const LoginStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    '@media (max-width: 128rem)': {
      flexDirection: 'column-reverse'
    }
  },
  bottomSide: {
    background: "#955B36",
    position: "fixed",
    bottom: '0',
    left: '0',
    width: '100%',
    height: '50%'
  },
  loginForm: {
    boxShadow: '0 0 0.8rem #bbb',
    zIndex: '1',
    width: '40rem',
    height: '40rem',
    background: 'white',
    position: 'absolute',
    top: '70%',
    left: '50%',
    transform: 'translate(-50%, 20%)',
    borderRadius: '2.4rem',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem'
  },
  h1Title: {
    textAlign: 'center',
    color: '#522917',
    fontWeight: 'bold',
    fontSize: '6rem',
    margin: '2rem 0'
  },
  labelText: {
    fontWeight: 'bold',
    padding: '1.2rem'
  },
  inputText: {
    color: 'black',
    fontFamily: 'Helvetica',
    padding: '1.2rem',
    borderRadius: '2.4rem',
  },
  optionLogin: {
    display: 'flex',
    marginTop: '0.8rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: 'black'
  },
  forgotPasswordBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
}));

export const ButtonLogin = withStyles({
  root: {
    alignSelf: 'center',
    backgroundColor: '#955B36',
    width: '50%',
    height: '4rem',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: '2.4rem',
    textTransform: 'none',
    marginTop: '2.4rem',
    '&:hover': {
      background: "#522917",
    }
  },
  label: {
    textTransform: 'none'
  }
})(Button);

// export const GoogleLogin = withStyles({
//   root: {
//     alignSelf: 'center',
//     backgroundColor: '#DB4437',
//     width: '80%',
//     height: '4rem',
//     fontSize: '1.6rem',
//     fontWeight: 'bold',
//     color: 'white',
//     borderRadius: '2.4rem',
//     textTransform: 'none',
//     marginTop: '2.4rem',
//     '&:hover': {
//       background: "#955B36",
//     }
//   },
//   label: {
//     textTransform: 'none'
//   }
// })(Button);

export const CheckboxRemember = withStyles({
  root: {
    transform: 'scale(1.25)'
  }
})(Checkbox);
