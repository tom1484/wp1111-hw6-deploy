import Router from 'express';
import ScoreCard from '../models/ScoreCard';


const router = Router();

const mongooseErrHandler = (res) => {
    res.status(200);
}

router.delete("/cards", (req, res) => {
    ScoreCard.deleteMany({}, (err) => {
        if (err) mongooseErrHandler(res);

        res.status(200).json({
            message: 'Database cleared', 
        });
    });
});

router.post("/card", (req, res) => {
    const { name, subject, score } = req.body;

    ScoreCard.find({ name: name, subject: subject }, (err, scoreCards) => {
        if (err) mongooseErrHandler(res);

        if (scoreCards.length == 0) {
            let scoreCard = new ScoreCard({
                name: name, 
                subject: subject, 
                score: score
            });
            scoreCard.save((err) => {
                if (err) mongooseErrHandler(res);
                res.status(200).json({
                    message: `Adding (${name}, ${subject}, ${score})`, 
                    card: scoreCard, 
                });
            });
        }
        else {
            let scoreCard = scoreCards[0];
            scoreCard.score = score;
            scoreCard.save((err) => {
                if (err) mongooseErrHandler(res);
                res.status(200).json({
                    message: `Updating (${name}, ${subject}, ${score})`, 
                    card: scoreCard, 
                });
            });
        }
    });
});

router.get("/cards", (req, res) => {
    const { type, queryString } = req.query;

    let query = {};
    if (type === 'name') query.name = queryString;
    else if (type === 'subject') query.subject = queryString;
    
    ScoreCard.find(query, (err, scoreCards) => {
        if (err) mongooseErrHandler(res);

        if (scoreCards.length == 0) {
            res.status(200).json({
                message: `QueryType (QueryString) not found!`, 
            });
        }
        else {
            const messages = scoreCards.map((scoreCard) => {
                let { name, subject, score } = scoreCard;
                return `Found card with ${type}: (${name}, ${subject}, ${score})`;
            });
            res.status(200).json({
                messages: messages, 
            });
        }
    });
});

export default router;