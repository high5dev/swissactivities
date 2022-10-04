import {useEffect, useState} from 'react';
import { connectSearchBox } from 'react-instantsearch-core';
import { useI18n } from 'next-localization';
import Calendar from 'react-calendar';
import { DateService } from "../../utils";
import styles from './styles.module.scss'

const DateFilter = ({ refine, setRefinement, currentRefinement, defaultRefinement }) => {
    const { t } = useI18n();
    const [{allDates, today, tomorrow}, setButtonState] = useState(DateService.initialButtonsState(currentRefinement));
    const [calendar, setCalendar] = useState(false);
    const [date, setDate] = useState(null);

    const filterHandler = ({target}) => {
        switch(true) {
            case target.id === 'tomorrow':
                setDate(DateService.tomorrowDate);
                refineHandler(DateService.tomorrowDate);
                break;
            case target.id === 'today':
                setDate(new Date());
                refineHandler(new Date());
                break;
            default:
                refineHandler('');
                setDate(null);
        }
        setCalendar(false);
        setButtonState({...DateService.initialState, [target.id]: true});
    }

    const calendarHandler = (date) => {
        const dateCurrent = new Date().toDateString();
        const pickedDate = date.toDateString();
        switch(true) {
            case pickedDate === dateCurrent:
                setButtonState({...DateService.initialState, today: true});
                break;
            case pickedDate === DateService.tomorrowDate.toDateString():
                setButtonState({...DateService.initialState, tomorrow: true});
                break;
            default:
                setButtonState(DateService.initialState);
        }
        setDate(date);
        refineHandler(date);
        setCalendar(false);
    }

    const refineHandler = (date) => {
        const refinedDate = date ? DateService.formatDate(date) : date;
        refine(refinedDate);
        setRefinement(refinedDate);
    }

    useEffect(() => {
        if (currentRefinement !== defaultRefinement) {
            refine('');
            setButtonState(DateService.initialButtonsState())
        }
    }, [defaultRefinement])

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h2>{t('filter.pickDate')}</h2>
            </div>
            <div className={styles.actions}>
                <button id="allDates" aria-pressed={allDates} onClick={filterHandler}>{t('filter.allDates')}</button>
                <button id="today" aria-pressed={today} onClick={filterHandler}>{t('filter.today')}</button>
                <button id="tomorrow" aria-pressed={tomorrow} onClick={filterHandler}>{t('filter.tomorrow')}</button>
            </div>
            {calendar
                    ?
                <div>
                    <Calendar
                        value={date}
                        onChange={calendarHandler}
                        prev2Label={null}
                        next2Label={null}
                        formatShortWeekday={(format, date) => DateService.formatWeekday(date, 'd')}
                    />
                </div>
                    :
                <a onClick={() => setCalendar(!calendar)}>{t('filter.viewCalendar')}</a>
            }
        </div>
    )
}

export default connectSearchBox(DateFilter);
// Algolia needs virtual components to keep refinements on dismount
export const VirtualDateFilter = connectSearchBox(() => null);
