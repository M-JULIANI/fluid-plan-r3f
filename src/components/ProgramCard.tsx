
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, IconButton, Stack } from '@mui/material';
import { LockOutlined, LockOpenOutlined, ArrowDropDown, SpaceBar, Close, Grid3x3 } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { InputLabel } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import { ProgramList } from '../constants/program';
import { padding } from '@mui/system';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

type ProgramCardProps = {
    category: string,
    name: string,
    length: number,
    width: number,
    locked: boolean,
    selected: boolean
}
const useStyles = makeStyles({
    container: {
        width: 970,
    },
    closeBtn: {
        color: 'gray',
        position: "absolute",
        top: "0px",
        right: "0px",
    },
    standardBtn: {
        // background: "white",
        width: 32,
        height: 32,
        color: "rgba(0, 0, 0, 0.4)",
        boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)"
    },
    alignRight: {
        float: 'revert'
    },
    label: {
        minWidth: "175px",
        fontSize: 8,
        marginTop: '0px',
        verticalAlign: 'top',
        padding: "0px 0px 0px 8px",
    },
    inputLabel: {
        minWidth: "100px",
        fontSize: 8,
        marginTop: '-16px',
        verticalAlign: 'top',
        margin: "0px 0px 0px 8px",
    },
    inputBase: {
        border: "1px solid #ced4da",
        minWidth: "150px",
        fontSize: 8,
        margin: "0px 0px 0px 8px",
        padding: "0px 0px 0px 8px",

    },
    menuItem: {
        margin: "0px 0px 0px 8px",
        padding: "0px 0px 0px 8px",
    },
    paddedForm: {
    },
    isLocked: {
        color: "black",
    },
    exitButtonPlacement: {
        marginLeft: "325px",
        marginTop: "-12px",
        horizontalAlign: "right",
    },
    lockedButtonPlacement: {
        marginLeft: "333px",
        marginBottom: "-2px",
    }
});

export default function ProgramCard(props: ProgramCardProps) {

    const { category, name, length, width, locked, selected } = props;
    const classes = useStyles();
    console.log('props at program card')
    console.log(props)

    const [isLocked, setLocked] = useState(locked);
    const [currentCategory, setCategory] = useState(category);
    const [isSelected, setSelected] = useState(selected);
    const handleLock = useCallback(() => {
        setLocked(state => !state)
    }, [])

    const handleCategory = (event: { target: { value: string } }) => {
        console.log(event.target.value)
        setCategory(event.target.value)
    }

    const handleCardClick = useCallback(() => {
        console.log(isSelected)
        setSelected(s => !s);
    }, [])
    return (
        <div style={{ padding: 10 }}>
            <Card sx={{ minWidth: 275 }} onMouseEnter={handleCardClick} onMouseLeave={handleCardClick} style={{ background: isSelected ? '#F2FBF7' : 'white' }}>
                <CardContent >
                    <div className={classes.exitButtonPlacement}>
                        <IconButton><Close /></IconButton>
                    </div>
                    <Grid2 spacing={0} container columns={2}>
                        <Grid2 xs={0}>
                            <FormControl sx={{ m: 2 }} variant="standard" className={classes.paddedForm}>
                                <InputLabel id="demo-customized-select-label" className={classes.label}>Program Category</InputLabel>
                                <Select className={classes.label}
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={currentCategory}
                                    onChange={handleCategory}>
                                    <MenuItem className={classes.menuItem} value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {ProgramList.map(key => {
                                        return < MenuItem className={classes.menuItem} value={key} > {key}</MenuItem>
                                    })}

                                </Select>
                            </FormControl>
                        </Grid2>

                        <Grid2 xs={5}>
                            <FormControl sx={{ m: 1 }} variant="standard" className={classes.paddedForm}>
                                <InputLabel htmlFor="demo-customized-textbox" className={classes.inputLabel}>Name</InputLabel>
                                <InputBase id="demo-customized-textbox" className={classes.inputBase}></InputBase>
                            </FormControl>
                        </Grid2>
                    </Grid2>
                </CardContent>
                <CardActions>

                    <div className={classes.lockedButtonPlacement}>
                        <IconButton onClick={handleLock}>
                            {isLocked ? <LockOpenOutlined /> : <LockOutlined className={classes.isLocked} />}
                        </IconButton>
                    </div>
                    {/* <Button color='primary'>Learn More</Button> */}
                </CardActions>
            </Card>
        </div >
    );
}
