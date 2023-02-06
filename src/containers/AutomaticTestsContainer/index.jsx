import React, {useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Search from './components/Search';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ParamsTab from './components/ParamsTab';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import AuthorizationTab from './components/AuthorizationTab';
import HeadersTab from './components/HeadersTab';
import BodyTab from './components/BodyTab';
import Aside from './components/Aside';
import {customget, custompost, customput, customdelete} from '../../lib/request';
import {addUrl, updateUrl} from '../../services/test.service';
import {useRouter} from 'next/router';
import { useMutation } from 'react-query';
import SaveUrlTestDialog from './components/SaveUrlTestDialog'
import {getParameters} from '../../utils/util'


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const options = ['EQUAL', 'CONTAINS', 'STATUS'];

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

const AutomaticTestsContainer = ({apps, test}) => {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef(null);

    const [saveUrlDialog, setSaveUrlDialog] = useState(false);

    const [selectedMethod, setSelectedMethod] = useState('');
    const [response, setResponse] = useState('');
    const [expect, setExpect] = useState('');
    const [statusRequest, setStatusRequest] = useState(0);
    const [testResult, setTestResult] = useState({
        message: '',
        type: ''
    });

    const [bodyTab, setBodyTab] = useState('form-data');

    const [params, setParams] = useState([{
        key: '',
        value: '',
        description: ''
    }]);

    const handleBodyTab = (event) => {
        setBodyTab(event.target.value);
    };

    const [url, setUrl] = useState('');
    
    const [raw, setRaw] = useState('');

    const handleRaw = e => setRaw(e.target.value);

    const handleUrl = e => setUrl(e.target.value);

    const handleExpect = e => setExpect(e.target.value);

    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const { mutate: save } = useMutation(addUrl, {
        onSuccess: (data) => {
            setSaveUrlDialog(false);
            router.reload();
        },
        onError: (error) => {
            alert('Error! ');
        }
    });

    const { mutate: update } = useMutation(updateUrl, {
        onSuccess: (data) => {
            router.reload();
        },
        onError: (error) => {
            alert('Error! ');
        }
    });

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const addRowToParams = () => {
        setParams(params => [...params, { 
            key: '',
            value: '',
            description: ''
        }]);
    }

    const removeRowToParams = index => {
         let arr = [...params];
         arr.splice(index, 1);
         setParams(arr);
    }

    const handleParam = (pos, key, value) => {
        let upd = [...params];
        let item = upd[pos];
        item[key] = value;
        upd[pos] = item;
        setParams(upd);
        setUrl(url+getParameters(upd));
    }

    useEffect(() => {
        if(test){
            setSelectedMethod(test.method);
            setUrl(test.url)
            setExpect(test.expect);
            setSelectedIndex(options.findIndex(d=>d===test.typeTest));
        }
        
        return () => {
            setSelectedMethod('');
            setUrl('');
            setExpect('');
            setSelectedIndex(-1);
        };
    }, [test]);


    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleMethod = value => setSelectedMethod(value);

    const send = async () => {
        if(url){
            switch (selectedMethod) {
                case methods[0]:
                    let parameters = getParameters(params);
                    let getResponse = await customget(url + parameters);
                    setResponse(JSON.stringify(getResponse.data));
                    setStatusRequest(getResponse.status);
                    break;
                case methods[1]:
                    let bodyPost = raw;
                    let postResponse = await custompost(url, bodyPost);
                    setResponse(JSON.stringify(postResponse.data));
                    setStatusRequest(postResponse.status);
                    break;
                case methods[2]:
                    let bodyPut = raw;
                    let putResponse = await customput(url, bodyPut);
                    setResponse(JSON.stringify(putResponse.data));
                    setStatusRequest(putResponse.status);
                    break;
                case methods[3]:
                    let delResponse = await customdelete(url);
                    setResponse(JSON.stringify(delResponse.data));
                    setStatusRequest(delResponse.status);
                    break;
                default:
                    let defaultResponse = await customget(url);
                    setResponse(JSON.stringify(defaultResponse.data));
                    setStatusRequest(defaultResponse.status);
                    break;
            }
        }
        
    }

    const runTest = () => {
        if (selectedIndex === -1 || !expect) {
            setTestResult({ type: 'error', message: 'Select a type and expect value for the test!' })
        }
        else {
            switch (options[selectedIndex]) {
                case options[0]:
                    verifyEqual();
                    break;
                case options[1]:
                    verifyContains();
                    break;
                case options[2]:
                    verifyStatus();
                    break;
            }
        }
    }

    function verifyStatus() {
        if(parseFloat(expect) === parseFloat(statusRequest)){
            setTestResult({type: 'success', message: 'Test passed successfully!'});
        }
        else{
            setTestResult({type: 'error', message: 'Test failed!'});
        }
    }

    function verifyContains() {
        if(String(response).includes(expect)){
            setTestResult({type: 'success', message: 'Test passed successfully!'});
        }
        else{
            setTestResult({type: 'error', message: 'Test failed!'});
        }
    }

    function verifyEqual() {
        if(response === expect){
            setTestResult({type: 'success', message: 'Test passed successfully!'});
        }
        else{
            setTestResult({type: 'error', message: 'Test failed!'});
        }
    }

    const closeAlert = () => {
        setTestResult({...testResult, message: ''})
    }

    const openDialogSaveUrl = () => {
        if(test){
            update({
                id: test._id,
                data: {
                    description: test.description,
                    url: url,
                    method: selectedMethod,
                    typeTest: options[selectedIndex],
                    expect: expect,
                    response: response
                }
            });
        }
        else{
            setSaveUrlDialog(true);
        } 
    }

    const saveUrl = values => {
        save({
            appId: values.app,
            data: {
                description: values.description,
                url: url,
                method: selectedMethod,
                typeTest: options[selectedIndex],
                expect: expect,
                response: response
            }
        });
    }


    return (
        <Grid container spacing={3}>
            <Grid xs={12} md={3} pt={3} item>
                <Paper elevation={3} p={1}>
                    <Aside apps={apps} />
                </Paper>
            </Grid>
            <Grid xs={12} md={9} item>
                <Grid container spacing={2}>
                    <Grid item xs={9} sx={{zIndex: 9}}>
                        <Search url={url} onChange={handleUrl} methods={methods} selectedMethod={selectedMethod} handleMethod={handleMethod} />
                    </Grid>
                    <Grid item xs={3}>
                        <Stack direction={'row'} justifyContent={'flex-end'} spacing={2} sx={{ paddingTop: '2px' }}>
                            <Button variant='contained' onClick={send}>{'Send'}</Button>
                            <Button variant='contained' onClick={openDialogSaveUrl}>{'Save'}</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={currentTab} onChange={handleTabChange}>
                                <Tab label="Params" {...a11yProps(0)} />
                                <Tab label="Authorization" {...a11yProps(1)} />
                                <Tab label="Headers" {...a11yProps(2)} />
                                <Tab label="Body" {...a11yProps(3)} />
                            </Tabs>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        { currentTab === 0 &&  <ParamsTab params={params} addRowToParams={addRowToParams} removeRowToParams={removeRowToParams} handleParam={handleParam} /> } 
                        { currentTab === 1 &&  <AuthorizationTab /> }
                        { currentTab === 2 && <HeadersTab /> }
                        { currentTab === 3 && <BodyTab raw={raw} handleRaw={handleRaw} tab={bodyTab} handleTab={handleBodyTab} /> }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='overline'>{'Test'}</Typography>
                       { testResult.message && <Alert severity={testResult.type} onClose={closeAlert}>{testResult.message}</Alert>} 
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={'row'} spacing={2}>
                            <Button
                                ref={anchorRef}
                                size="small"
                                color='info'
                                sx={{ width: '150px' }}
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                                variant={'contained'}
                            >
                                {options[selectedIndex] || 'Type'}
                                <ArrowDropDownIcon />
                            </Button>
                            <Popper
                                sx={{
                                    zIndex: 1,
                                }}
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList id="split-button-menu" autoFocusItem>
                                                    {options.map((option, index) => (
                                                        <MenuItem
                                                            key={option}
                                                            selected={index === selectedIndex}
                                                            onClick={(event) => handleMenuItemClick(event, index)}
                                                        >
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                            <TextField variant='outlined' value={expect} onChange={handleExpect} size='small' fullWidth label={'Expect'} />
                            <Button variant='contained' onClick={runTest}>{'Test'}</Button>
                        </Stack>
                    </Grid>
                    <Grid xs={12} item>
                        <TextareaAutosize value={response} placeholder="Response" minRows={7} disabled style={{width: '100%'}} />                                    
                    </Grid>
                </Grid>
            </Grid>

            <SaveUrlTestDialog open={saveUrlDialog} close={()=>setSaveUrlDialog(false)} save={saveUrl} apps={apps} />
        </Grid>
    );
};

export default AutomaticTestsContainer;