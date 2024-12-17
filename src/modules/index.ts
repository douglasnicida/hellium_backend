import { FastifyInstance, FastifyPluginCallback } from "fastify";
import authRoute from "./auth/auth.route";
import productsRoute from "./product/product.route";
import { UserSchema } from "./auth/auth.schema";
import { CustomerSchema } from "./costumer/costumer.schema";
import { ProductSchema } from "./product/product.schema";
import { IngredientSchema } from "./ingredient/ingredient.schema";
import { RecipeSchema } from "./recipe/recipe.schema";
import { ItemSchema } from "./item/item.schema";
import { SaleSchema } from "./sale/sale.schema";

// Routes
export const registerRoutes: FastifyPluginCallback = (fastifyApp: FastifyInstance, opts, done) => {
    fastifyApp.register(authRoute, {prefix: '/auth'});
    fastifyApp.register(productsRoute, {prefix: '/products'});
    
    done();
}

// Schemas
export async function registerSchemas(fastifyApp: FastifyInstance) {
    fastifyApp.addSchema(UserSchema);
    fastifyApp.addSchema(CustomerSchema);
    fastifyApp.addSchema(ProductSchema);
    fastifyApp.addSchema(IngredientSchema);
    fastifyApp.addSchema(RecipeSchema);
    fastifyApp.addSchema(ItemSchema);
    fastifyApp.addSchema(SaleSchema);
}

