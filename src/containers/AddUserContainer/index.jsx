import React from 'react';
import { Grid, TextField, Button, Paper } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { addUser } from '../../services/tenant.service';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const errorText = { color: '#E8530E' };

const AddUserContainer = () => {

  const router = useRouter();
  const { handleSubmit, formState: { errors }, control } = useForm();

  const { mutate: createUser } = useMutation(addUser, {
    onSuccess: (data) => {
      alert("Usuario registrado satisfactoriamente.");
      router.reload();
    },
    onError: (error) => {
      alert(error.response.data.message);
    }
  });

  const onSubmit = (data) => {
    data.phone = String(data.phone).replace(/[{()}-]/g,'');
    createUser(data);
  }


  return (
    <Grid container pt={6} justifyContent={'center'}>
      <Paper elevation={3} sx={{pt:3}}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: 'inherit' }}>
          <Grid item xs={12} my={3}>
            <Grid container justifyContent={'center'} spacing={2}>
              <Grid item md={7} xs={11}>
                <Controller
                  control={control}
                  name="fullname"
                  rules={{ required: true }}
                  render={({ field }) => <TextField size={'small'} fullWidth placeholder={'Nombre y apellidos *'} {...field} />}
                />
                {
                  errors.fullname && <label style={errorText}>{'El nombre completo del usuario es requerido'}</label>
                }
              </Grid>
              <Grid item md={7} xs={11}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: true }}
                  render={({ field }) => <TextField size={'small'} fullWidth placeholder={'Telefono *'} {...field} />}
                />
                {
                  errors.phone && <label style={errorText}>{'El telefono es requerido'}</label>
                }
              </Grid>
              <Grid item md={7} xs={11}>
                <Controller
                  control={control}
                  name="userRole"
                  rules={{ required: true }}
                  render={({ field }) =>
                  <FormControl sx={{minWidth: 120 }} fullWidth size="small">
                  <InputLabel id="demo-select-small">{'Role'}</InputLabel>
                  <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  {...field}
                  label="Rol"
                >
                  <MenuItem value={'administrator'}>{'Administrador'}</MenuItem>
                  <MenuItem value={'employee'}>{'Empleado'}</MenuItem>
                </Select>  
                </FormControl>
                }
                />
                {
                  errors.phone && <label style={errorText}>{'El rol es requerido'}</label>
                }
              </Grid>
              <Grid item md={7} xs={11}>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: true }}
                  render={({ field }) => <TextField size={'small'} type={'password'} fullWidth placeholder={'Contraseña *'} {...field} />}
                />
                {
                  errors.password && <label style={errorText}>{'La contraseña es requerida'}</label>
                }
              </Grid>
              <Grid item md={7} xs={11} textAlign={'right'}>
                <Button
                  variant={'contained'}
                  type="submit"
                >
                  {'Registrar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default AddUserContainer;