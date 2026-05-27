import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // navbar
    brandName: 'FamilyTree',
    navDashboard: 'Dashboard',
    navFamilyTree: 'Family Tree',
    navLogout: 'Logout',

    // auth – login
    signInTitle: 'Sign in to your account',
    mobileNumber: 'Mobile Number',
    emailAddress: 'Email Address',
    emailOptional: 'Email Address (Optional)',
    password: 'Password',
    yourPassword: 'Your password',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    signUpLink: 'Sign up',
    mobileRequired: 'Mobile number is required',
    invalidMobile: 'Enter a valid 10-digit mobile number',
    emailRequired: 'Email is required',
    invalidEmail: 'Invalid email',
    invalidEmailFormat: 'Invalid email format',
    passwordRequired: 'Password is required',

    // auth – signup
    createAccountTitle: 'Create your account',
    mobilePlaceholder: 'મોબાઈલ નંબર અહી નાખો',
    minChars: 'Min. 6 characters',
    confirmPassword: 'Confirm Password',
    reEnterPassword: 'Re-enter password',
    creatingAccount: 'Creating account...',
    createAccountBtn: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    passwordMinLength: 'Password must be at least 6 characters',
    confirmPasswordRequired: 'Please confirm your password',
    passwordsNoMatch: 'Passwords do not match',

    // complete profile
    completeProfile: 'Complete Your Profile',
    completeProfileSub: 'Tell us a bit about yourself to get started',
    firstName: 'First Name',
    lastName: 'Last Name',
    city: 'City',
    kuldeviName: 'Madh/Kuldevi Name',
    surapura: 'Surapura',
    contactNumber: 'Contact Number',
    saving: 'Saving...',
    saveAndContinue: 'Save & Continue',
    firstNamePlaceholder: 'Hiten',
    lastNamePlaceholder: 'Dodiya',
    cityPlaceholder: 'Your city',
    kuldeviPlaceholder: '-- Select Madh/Kuldevi --',
    surapuraPlaceholder: 'e.g. Surapura / village name',
    contactPlaceholder: '+91 9876543210',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    cityRequired: 'City is required',
    kuldeviRequired: 'Kuldevi name is required',
    surapuraRequired: 'Surapura is required',
    contactRequired: 'Contact number is required',

    // dashboard
    loading: 'Loading...',
    welcomeBack: 'Welcome back,',
    dashboardSubtitle: 'Manage your family tree and keep your heritage alive.',
    myFamilyTree: 'My Family Tree',
    familyTreeSub: 'Build and visualize your family lineage',
    totalMembers: 'Total Members',
    male: 'Male',
    female: 'Female',
    viewEditTree: 'View / Edit Tree',
    noFamilyTree: 'No family tree yet',
    noFamilyTreeSub: 'Start building your family tree by adding members',
    createFamilyTree: 'Create Family Tree',
    myProfile: 'My Profile',
    myProfileSub: 'Your account details',
    fullName: 'Full Name',
    kuldevi: 'Madh/Kuldevi',
    surapuraLabel: 'Surapura',
    contact: 'Contact',
    profileComplete: '✓ Profile Complete',
    profileIncomplete: '⚠ Profile Incomplete',
    editProfileBtn: 'Edit Profile',
    editProfileTitle: 'Edit Profile',
    editProfileSub: 'Update your account details',
    updateProfile: 'Update Profile',
    updatingProfile: 'Updating...',
    profileUpdated: 'Profile updated successfully!',
    failedToUpdate: 'Failed to update profile',

    // family tree builder page
    back: 'Back',
    familyTreeBuilder: 'Family Tree Builder',
    members: 'members',
    member: 'member',
    editTree: 'Edit Tree',
    addNewRoot: 'Add New Root',
    rootLegend: 'Root',
    clickNodeToSelect: 'Click any node to select it',

    // action panel
    growYourTree: 'GROW YOUR TREE',
    addRootAncestor: 'Add Root Ancestor',
    addChild: 'Add Child',
    addSibling: 'Add Sibling',
    addParent: 'Add Parent',
    selectedLabel: 'SELECTED',
    edit: 'Edit',
    delete: 'Delete',
    clickCardToSelect: 'Click a card to select',
    savingTree: 'Saving…',
    saveTree: 'Save Tree',

    // node modal
    fillDetails: 'Fill in the details below',
    fullNameLabel: 'FULL NAME',
    enterFullName: 'Enter full name',
    nameRequired: 'Name is required',
    nicknameLabel: 'NICKNAME',
    optional: '(optional)',
    nicknamePlaceholder: 'e.g. Dada, Dadi',
    genderLabel: 'GENDER',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    dobLabel: 'DATE OF BIRTH',
    dobOptional: '(optional)',
    cancel: 'Cancel',
    saveMember: 'Save Member',

    // empty tree
    plantFamilyTree: 'Plant Your Family Tree',
    plantFamilyTreeSub: 'Add the first ancestor to grow your tree',
    plantRootAncestor: 'Plant Root Ancestor',

    // modal titles
    addRootMember: 'Add Root Member',
    addChildModal: 'Add Child',
    addBrotherSister: 'Add Brother',
    addParentModal: 'Add Parent',
    editMember: 'Edit Member',

    // payment page
    paymentTitle: 'Complete Payment',
    paymentSub: 'Scan the QR code below and complete your payment',
    paymentAmount: 'Amount to Pay',
    paymentInstruction: 'Open any UPI app, scan the QR code and pay the amount shown above.',
    paymentDoneBtn: 'Payment Completed',
    paymentProcessing: 'Please wait...',
    paymentSuccess: 'Payment marked! Awaiting admin approval.',
    paymentFailed: 'Failed to record payment. Please try again.',
    noQrCode: 'QR code not set up yet. Please contact admin.',

    // toasts
    selectMemberFirst: 'Select a member first',
    memberUpdated: 'Member updated',
    rootMemberAdded: 'Root member added',
    childAdded: 'Child added',
    siblingAdded: 'Sibling added',
    parentAdded: 'Parent added',
    memberDeleted: 'Member deleted',
    addAtLeastOneMember: 'Add at least one member',
    familyTreeSaved: 'Family tree saved!',
    failedToSave: 'Failed to save',
    failedToLoad: 'Failed to load family tree',
    failedToLoadData: 'Failed to load data',
    accountCreated: 'Account created! Please complete your profile.',
    loginSuccess: 'Login successful!',
    profileCompleted: 'Profile completed!',
    failedToSaveProfile: 'Failed to save profile',
    loginFailed: 'Login failed',
    registrationFailed: 'Registration failed',

    // delete confirm
    deleteWithDescendants: (count) => `This will also delete ${count} descendant(s). Are you sure?`,
    deleteMember: 'Delete this member?',

    // language switcher
    language: 'Language',
    gujarati: 'ગુજરાતી',
    english: 'English',
  },

  gu: {
    // navbar
    brandName: 'કુટુંબ વૃક્ષ',
    navDashboard: 'ડૅશબોર્ડ',
    navFamilyTree: 'કુટુંબ વૃક્ષ',
    navLogout: 'લૉગ આઉટ',

    // auth – login
    signInTitle: 'તમારા એકાઉન્ટમાં સાઇન ઇન કરો',
    mobileNumber: 'મોબાઇલ નંબર',
    emailAddress: 'ઇમેઇલ સરનામું',
    emailOptional: 'ઇમેઇલ સરનામું (વૈકલ્પિક)',
    password: 'પાસવર્ડ',
    yourPassword: 'તમારો પાસવર્ડ',
    signingIn: 'સાઇન ઇન થઈ રહ્યું છે...',
    signIn: 'સાઇન ઇન',
    noAccount: 'એકાઉન્ટ નથી?',
    signUpLink: 'સાઇન અપ',
    mobileRequired: 'મોબાઇલ નંબર જરૂરી છે',
    invalidMobile: '10 અંકનો માન્ય મોબાઇલ નંબર દાખલ કરો',
    emailRequired: 'ઇમેઇલ જરૂરી છે',
    invalidEmail: 'અમાન્ય ઇમેઇલ',
    invalidEmailFormat: 'અમાન્ય ઇમેઇલ ફોર્મેટ',
    passwordRequired: 'પાસવર્ડ જરૂરી છે',

    // auth – signup
    createAccountTitle: 'તમારું એકાઉન્ટ બનાવો',
    mobilePlaceholder: 'મોબાઈલ નંબર અહી નાખો',
    minChars: 'ઓછામાં ઓછા 6 અક્ષરો',
    confirmPassword: 'પાસવર્ડ પુષ્ટિ કરો',
    reEnterPassword: 'પાસવર્ડ ફરી દાખલ કરો',
    creatingAccount: 'એકાઉન્ટ બનાવી રહ્યું છે...',
    createAccountBtn: 'એકાઉન્ટ બનાવો',
    alreadyHaveAccount: 'પહેલેથી એકાઉન્ટ છે?',
    signInLink: 'સાઇન ઇન',
    passwordMinLength: 'પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ',
    confirmPasswordRequired: 'કૃપા કરી તમારો પાસવર્ડ પુષ્ટિ કરો',
    passwordsNoMatch: 'પાસવર્ડ મેળ ખાતો નથી',

    // complete profile
    completeProfile: 'તમારી પ્રોફાઇલ પૂર્ણ કરો',
    completeProfileSub: 'શરૂ કરવા માટે તમારા વિશે થોડું જણાવો',
    firstName: 'પ્રથમ નામ',
    lastName: 'અટક',
    city: 'શહેર',
    kuldeviName: 'મઢ/કુળદેવી નામ',
    surapura: 'સુરાપુરા',
    contactNumber: 'સંપર્ક નંબર',
    saving: 'સાચવી રહ્યું છે...',
    saveAndContinue: 'સાચવો અને ચાલુ રાખો',
    firstNamePlaceholder: 'હિતેન',
    lastNamePlaceholder: 'ડોડીયા',
    cityPlaceholder: 'તમારું શહેર',
    kuldeviPlaceholder: '-- મઢ/કુળદેવી પસંદ કરો --',
    surapuraPlaceholder: 'દા.ત. સુરાપુરા / ગામ નું નામ',
    contactPlaceholder: '+91 9876543210',
    firstNameRequired: 'પ્રથમ નામ જરૂરી છે',
    lastNameRequired: 'અટક જરૂરી છે',
    cityRequired: 'શહેર જરૂરી છે',
    kuldeviRequired: 'કુળદેવી નામ જરૂરી છે',
    surapuraRequired: 'સુરાપુરા જરૂરી છે',
    contactRequired: 'સંપર્ક નંબર જરૂરી છે',

    // dashboard
    loading: 'લોડ થઈ રહ્યું છે...',
    welcomeBack: 'પાછા આવ્યા,',
    dashboardSubtitle: 'તમારા કુટુંબ વૃક્ષનું સંચાલન કરો અને તમારી વિરાસતને જીવંત રાખો.',
    myFamilyTree: 'મારું કુટુંબ વૃક્ષ',
    familyTreeSub: 'તમારી કૌટુંબિક વંશાવળી બનાવો અને જોઓ',
    totalMembers: 'કુલ સભ્યો',
    male: 'પુરુષ',
    female: 'સ્ત્રી',
    viewEditTree: 'વૃક્ષ જુઓ / સંપાદિત કરો',
    noFamilyTree: 'હજી કુટુંબ વૃક્ષ નથી',
    noFamilyTreeSub: 'સભ્યો ઉમેરીને તમારું કુટુંબ વૃક્ષ બનાવવાનું શરૂ કરો',
    createFamilyTree: 'કુટુંબ વૃક્ષ બનાવો',
    myProfile: 'મારી પ્રોફાઇલ',
    myProfileSub: 'તમારા એકાઉન્ટની વિગતો',
    fullName: 'પૂરું નામ',
    kuldevi: 'મઢ/કુળદેવી',
    surapuraLabel: 'સુરાપુરા',
    contact: 'સંપર્ક',
    profileComplete: '✓ પ્રોફાઇલ પૂર્ણ',
    profileIncomplete: '⚠ પ્રોફાઇલ અધૂરી',
    editProfileBtn: 'પ્રોફાઇલ સંપાદિત કરો',
    editProfileTitle: 'પ્રોફાઇલ સંપાદિત કરો',
    editProfileSub: 'તમારા ખાતાની વિગતો અપડેટ કરો',
    updateProfile: 'પ્રોફાઇલ અપડેટ કરો',
    updatingProfile: 'અપડેટ થઈ રહ્યું છે...',
    profileUpdated: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ!',
    failedToUpdate: 'પ્રોફાઇલ અપડેટ કરવામાં નિષ્ફળ',

    // family tree builder page
    back: 'પાછળ',
    familyTreeBuilder: 'કુટુંબ વૃક્ષ નિર્માણ',
    members: 'સભ્યો',
    member: 'સભ્ય',
    editTree: 'વૃક્ષ સંપાદિત કરો',
    addNewRoot: 'નવો મૂળ ઉમેરો',
    rootLegend: 'મૂળ',
    clickNodeToSelect: 'પસંદ કરવા માટે કોઈ નોડ પર ક્લિક કરો',

    // action panel
    growYourTree: 'તમારું વૃક્ષ વિકસાવો',
    addRootAncestor: 'મૂળ પૂર્વજ ઉમેરો',
    addChild: 'બાળક ઉમેરો',
    addSibling: 'ભાઈ ઉમેરો',
    addParent: 'પિતા ઉમેરો',
    selectedLabel: 'પસંદ',
    edit: 'સંપાદિત',
    delete: 'કાઢો',
    clickCardToSelect: 'પસંદ કરવા કાર્ડ પર ક્લિક કરો',
    savingTree: 'સાચવી રહ્યું છે...',
    saveTree: 'વૃક્ષ સાચવો',

    // node modal
    fillDetails: 'નીચે વિગતો ભરો',
    fullNameLabel: 'પૂરું નામ',
    enterFullName: 'પૂરું નામ દાખલ કરો',
    nameRequired: 'નામ જરૂરી છે',
    nicknameLabel: 'ઉર્ફે',
    optional: '(વૈકલ્પિક)',
    nicknamePlaceholder: 'દા.ત. દાદા',
    genderLabel: 'જાતિ',
    genderMale: 'પુરુષ',
    genderFemale: 'સ્ત્રી',
    genderOther: 'અન્ય',
    dobLabel: 'જન્મ તારીખ',
    dobOptional: '(વૈકલ્પિક)',
    cancel: 'રદ કરો',
    saveMember: 'સભ્ય સાચવો',

    // empty tree
    plantFamilyTree: 'તમારું કુટુંબ વૃક્ષ રોપો',
    plantFamilyTreeSub: 'તમારા વૃક્ષ ઉગાડવા માટે પ્રથમ પૂર્વજ ઉમેરો',
    plantRootAncestor: 'મૂળ પૂર્વજ રોપો',

    // modal titles
    addRootMember: 'મૂળ સભ્ય ઉમેરો',
    addChildModal: 'બાળક ઉમેરો',
    addBrotherSister: 'ભાઈ ઉમેરો',
    addParentModal: 'પિતા ઉમેરો',
    editMember: 'સભ્ય સંપાદિત કરો',

    // payment page
    paymentTitle: 'ચુકવણી પૂર્ણ કરો',
    paymentSub: 'નીચે QR કોડ સ્કૅન કરો અને ચુકવણી કરો',
    paymentAmount: 'ચૂકવવાની રકમ',
    paymentInstruction: 'કોઈ પણ UPI એપ ખોલો, QR કોડ સ્કૅન કરો અને ઉપર બતાવેલ રકમ ચૂકવો.',
    paymentDoneBtn: 'ચુકવણી પૂર્ણ થઈ',
    paymentProcessing: 'રાહ જુઓ...',
    paymentSuccess: 'ચુકવણી નોંધાઈ! એડ્મિન મંજૂરીની રાહ.',
    paymentFailed: 'ચુકવણી નોંધવામાં નિષ્ફળ. ફરી પ્રયાસ કરો.',
    noQrCode: 'QR કોડ હજી સેટ નથી. કૃપા કરી એડ્મિનનો સંપર્ક કરો.',

    // toasts
    selectMemberFirst: 'પ્રથમ સભ્ય પસંદ કરો',
    memberUpdated: 'સભ્ય અપડેટ થયો',
    rootMemberAdded: 'મૂળ સભ્ય ઉમેરાયો',
    childAdded: 'બાળક ઉમેરાયો',
    siblingAdded: 'ભાઈ ઉમેરાયા',
    parentAdded: 'પિતા ઉમેરાયા',
    memberDeleted: 'સભ્ય કાઢ્યો',
    addAtLeastOneMember: 'ઓછામાં ઓછો એક સભ્ય ઉમેરો',
    familyTreeSaved: 'કુટુંબ વૃક્ષ સાચવ્યું!',
    failedToSave: 'સાચવવામાં નિષ્ફળ',
    failedToLoad: 'કુટુંબ વૃક્ષ લોડ કરવામાં નિષ્ફળ',
    failedToLoadData: 'ડેટા લોડ કરવામાં નિષ્ફળ',
    accountCreated: 'એકાઉન્ટ બન્યું! કૃપા કરી તમારી પ્રોફાઇલ પૂર્ણ કરો.',
    loginSuccess: 'સફળતાપૂર્વક સાઇન ઇન!',
    profileCompleted: 'પ્રોફાઇલ પૂર્ણ!',
    failedToSaveProfile: 'પ્રોફાઇલ સાચવવામાં નિષ્ફળ',
    loginFailed: 'સાઇન ઇન નિષ્ફળ',
    registrationFailed: 'નોંધણી નિષ્ફળ',

    // delete confirm
    deleteWithDescendants: (count) => `આ ${count} વંશ(ઓ)ને પણ કાઢી નાખશે. શું તમને ખાતરી છે?`,
    deleteMember: 'આ સભ્ય કાઢી નાખો?',

    // language switcher
    language: 'ભાષા',
    gujarati: 'ગુજરાતી',
    english: 'English',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'gu');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('app_lang', l);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
