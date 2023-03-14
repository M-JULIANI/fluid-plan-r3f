
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

type ProgramCardProps = {
    category: string,
    name: string,
    length: number,
    width: number,
    locked: boolean,

}
export default function ProgramCard(props: ProgramCardProps) {

    const { category, name, length, width, locked } = props;
    console.log('props at program card')
    console.log(props)
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
                    {category}
                </Typography>
                <Typography variant="h6" component="div">
                    {name}
                </Typography>
                <Typography variant="body2">
                    {`length: ${length}`}
                </Typography>
                <Typography variant="body2">
                    {`width: ${width}`}
                    <br />
                    {/* {'"a benevolent smile"'} */}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}
