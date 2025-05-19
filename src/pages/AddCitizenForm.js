import React from 'react';
import useCitizenContract from '../hooks/useCitizenContract';
import styles from './AddCitizenForm.module.css';

const AddCitizenForm = () => {
    const { form, handleChange, handleSubmit, loading } = useCitizenContract();

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Add New Citizen</h2>
            <p className={styles.subheader}>Please provide the details below to add a new citizen.</p>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="age" className={styles.label}>Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            value={form.age}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="city" className={styles.label}>City</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={form.city}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="note" className={styles.label}>Notes</label>
                        <textarea
                            id="note"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className={styles.textarea}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Adding Citizen...' : 'Add Citizen'}
                </button>
            </form>
        </div>
    );
};

export default AddCitizenForm;
