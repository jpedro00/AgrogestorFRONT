import {test,expect,type Page} from '@playwright/test';

async function enter(page:Page,role='usuario') {
  await page.goto('/login');
  await page.getByLabel('E-mail',{exact:true}).fill(`${role}@agrogestor.demo`);
  await page.getByLabel('Senha de demonstração',{exact:true}).fill('Demo@123');
  await page.getByRole('button',{name:'Entrar',exact:true}).click();
}
test('todos os shells da fazenda navegam e voltam',async({page})=>{
  await enter(page);
  await page.getByRole('button',{name:'Entrar no AgroGestor',exact:true}).click();
  await page.getByRole('button',{name:'Acesso rápido: Minha Fazenda'}).click();
  for(const title of ['Talhões','Registrar atividade','Estoque','Alertas','Histórico']) {
    await page.getByRole('button',{name:title,exact:true}).click();
    await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Protótipo em desenvolvimento'})).toBeVisible();
    await page.getByRole('button',{name:'Voltar',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Minha Fazenda',exact:true})).toBeVisible();
  }
});
test('todos os módulos administrativos são navegáveis',async({page})=>{
  await enter(page,'admin');
  await page.getByRole('button',{name:'Abrir Dashboard Admin'}).click();
  // Start with a module that does not duplicate a dashboard quick action.
  for(const title of ['Talhões','Propriedades','Culturas e Safras','Atividades','Estoque','Alertas','Relatórios','Usuários e Permissões','Configurações','Marketplace','Negociações','Documentos','Crédito e Propostas','Contratos e Assinaturas']) {
    if(test.info().project.name==='mobile')await page.getByRole('button',{name:'Abrir menu administrativo'}).click();
    await page.getByRole('button',{name:title,exact:true}).click();
    await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Protótipo em desenvolvimento'})).toBeVisible();
  }
});
test('comprador não vê dados privados; favoritos funcionam durante a sessão',async({page})=>{
  await enter(page,'comprador');
  await page.getByRole('button',{name:'Entrar no AgroGestor',exact:true}).click();
  await expect(page.getByText('Fazenda Santa Clara',{exact:false})).toHaveCount(0);
  await page.getByRole('button',{name:'Acesso rápido: Minha Fazenda'}).click();
  await expect(page.getByRole('heading',{name:'Acesso restrito'})).toBeVisible();
  await page.getByRole('button',{name:'Mercado',exact:true}).click();
  await page.getByRole('button',{name:'Favoritar: Fazenda Boa Vista',exact:true}).click();
  await page.getByRole('button',{name:'Favoritos',exact:true}).click();
  await expect(page.getByRole('button',{name:'Ver oportunidade: Fazenda Boa Vista'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Ver oportunidade: Lote de novilhas Nelore'})).toHaveCount(0);
});
test('preferências alteram Home e conectividade informa offline',async({page})=>{
  await enter(page);
  await page.getByRole('button',{name:'Meu perfil',exact:true}).click();
  await page.getByRole('switch',{name:'Modo Simplificado'}).click();
  await page.getByRole('switch',{name:'Modo Assistido'}).click();
  await expect(page.getByText('Pendente de sincronização · demonstração',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Início',exact:true}).click();
  await expect(page.getByText('Estoque adequado',{exact:true})).toHaveCount(0);
  await expect(page.getByText('Comece pelo acesso rápido abaixo.',{exact:false})).toBeVisible();
  await page.context().setOffline(true);
  await expect(page.getByText('Offline · dados de demonstração',{exact:true})).toBeVisible();
  await page.context().setOffline(false);
  await expect(page.getByText('Online · demonstração',{exact:true})).toBeVisible();
});
