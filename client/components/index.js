// import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar';
export {default as HomeLanding} from './HomeLanding';
export {default as AllAwards} from './AllAwards';
export {default as SingleAward} from './SingleAward';
export {default as NominateForm} from './NominateForm';
export {default as DonateForm} from './DonateForm';
export {default as SignUpForm} from './SignUpForm';
export {default as Confirmation} from './Confirmation';
export {default as Intro} from './Intro';
export {default as UserDashboard} from './UserDashboard';
export {default as EditAwards} from './EditAwards';

export {Login} from './auth-form';
